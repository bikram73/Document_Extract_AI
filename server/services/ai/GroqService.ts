import { AIService } from "./ProviderInterface";
import { ExtractedData, validateResponse } from "./ResponseValidator";
import { buildPrompt } from "./PromptBuilder";
import { extractTextFromPdf } from "./PdfParser";

export class GroqService implements AIService {
  name = "groq";

  async healthCheck(): Promise<boolean> {
    return !!process.env.GROQ_API_KEY;
  }

  async extractStructuredData(base64Data: string, mimeType: string): Promise<ExtractedData> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured.");
    }

    const hasImage = mimeType.startsWith("image/");
    const customModel = process.env.GROQ_MODEL;

    // Dedicated vision models for image extraction
    const visionCandidates = [
      "llama-3.2-11b-vision-preview",
      "llama-3.2-90b-vision-preview",
    ];

    // Dedicated text models for PDF/text-based extraction
    const textCandidates = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
    ];

    // Decide candidates based on input type (images must use vision-capable models)
    let candidates = hasImage ? visionCandidates : textCandidates;

    // If a custom model is provided, prioritize it
    if (customModel) {
      candidates = [customModel, ...candidates.filter(m => m !== customModel)];
    }

    let promptText = buildPrompt();

    // If it's a PDF, extract the text and append it to the prompt
    if (mimeType === "application/pdf") {
      try {
        console.log("[GroqService] PDF detected. Extracting raw text to process with fallback.");
        const pdfText = await extractTextFromPdf(base64Data);
        promptText += `\n\n--- START OF EXTRACTED PDF TEXT CONTENT ---\n${pdfText}\n--- END OF EXTRACTED PDF TEXT CONTENT ---`;
      } catch (err: any) {
        console.error("[GroqService] Failed to extract text from PDF:", err);
        throw new Error(`Groq does not support native PDF inputs, and PDF text extraction failed: ${err.message || err}`);
      }
    }

    // Prepare content payload
    const content: any[] = [{ type: "text", text: promptText }];

    // If it's an image, we send it as an image_url
    if (hasImage) {
      content.push({
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${base64Data}`,
        },
      });
    }

    let lastError: any = null;

    for (const model of candidates) {
      // We will try JSON mode first, and if that fails, we try standard mode
      for (const useJsonFormat of [true, false]) {
        try {
          console.log(`[GroqService] Attempting extraction with model: ${model} (JSON mode: ${useJsonFormat})`);
          
          const bodyPayload: any = {
            model: model,
            messages: [
              {
                role: "user",
                content: content,
              },
            ],
            temperature: 0.1,
            max_tokens: 1500,
          };

          if (useJsonFormat) {
            bodyPayload.response_format = { type: "json_object" };
          }

          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(bodyPayload),
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Groq API failed with status ${response.status}: ${errText}`);
          }

          const payload: any = await response.json();
          if (payload.error) {
            throw new Error(`Groq API Error: ${payload.error.message || JSON.stringify(payload.error)}`);
          }
          const rawText = payload.choices?.[0]?.message?.content;

          if (!rawText) {
            throw new Error("No response text found in Groq choices payload.");
          }

          console.log(`[GroqService] Successfully extracted data using model: ${model}`);
          return validateResponse(rawText);
        } catch (err: any) {
          lastError = err;
          console.warn(`[GroqService] Model ${model} (JSON mode: ${useJsonFormat}) failed:`, err.message || err);
        }
      }
    }

    throw lastError || new Error("All candidate Groq models failed to process the request.");
  }
}

