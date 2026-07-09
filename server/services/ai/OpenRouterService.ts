import { AIService } from "./ProviderInterface";
import { ExtractedData, validateResponse } from "./ResponseValidator";
import { buildPrompt } from "./PromptBuilder";
import { extractTextFromPdf } from "./PdfParser";

export class OpenRouterService implements AIService {
  name = "openrouter";

  async healthCheck(): Promise<boolean> {
    return !!process.env.OPENROUTER_API_KEY;
  }

  async extractStructuredData(base64Data: string, mimeType: string): Promise<ExtractedData> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    const hasImage = mimeType.startsWith("image/");
    const customModel = process.env.OPENROUTER_MODEL;

    // Dedicated vision models for image extraction
    const visionCandidates = [
      "google/gemini-2.5-flash",
      "meta-llama/llama-3.2-11b-vision-instruct",
      "meta-llama/llama-3.2-11b-vision-instruct:free",
      "meta-llama/llama-3.2-90b-vision-instruct",
    ];

    // Dedicated text models for PDF/text-based extraction
    const textCandidates = [
      "deepseek/deepseek-chat",
      "deepseek/deepseek-chat:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "meta-llama/llama-3.3-70b-instruct",
      "qwen/qwen-2.5-coder-32b-instruct",
      "google/gemini-2.5-flash",
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
        console.log("[OpenRouterService] PDF detected. Extracting raw text to process with fallback.");
        const pdfText = await extractTextFromPdf(base64Data);
        promptText += `\n\n--- START OF EXTRACTED PDF TEXT CONTENT ---\n${pdfText}\n--- END OF EXTRACTED PDF TEXT CONTENT ---`;
      } catch (err: any) {
        console.error("[OpenRouterService] Failed to extract text from PDF:", err);
        throw new Error(`OpenRouter does not support native PDF inputs, and PDF text extraction failed: ${err.message || err}`);
      }
    }

    // Prepare content payload
    const content: any[] = [{ type: "text", text: promptText }];

    // If it's an image, we send it as an image_url (OpenRouter supports standard OpenAI format)
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
          console.log(`[OpenRouterService] Attempting extraction with model: ${model} (JSON mode: ${useJsonFormat})`);
          
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

          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
              "HTTP-Referer": "https://docextract-ai.netlify.app", // Optional header
              "X-Title": "DocExtract AI", // Optional header
            },
            body: JSON.stringify(bodyPayload),
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`OpenRouter API failed with status ${response.status}: ${errText}`);
          }

          const payload: any = await response.json();
          if (payload.error) {
            throw new Error(`OpenRouter API Error: ${payload.error.message || JSON.stringify(payload.error)}`);
          }
          const rawText = payload.choices?.[0]?.message?.content;

          if (!rawText) {
            throw new Error("No response text found in OpenRouter choices payload.");
          }

          console.log(`[OpenRouterService] Successfully extracted data using model: ${model}`);
          return validateResponse(rawText);
        } catch (err: any) {
          lastError = err;
          console.warn(`[OpenRouterService] Model ${model} (JSON mode: ${useJsonFormat}) failed:`, err.message || err);
          
          // If JSON mode was true and it failed, we'll try false in the next iteration of the inner loop
          // If JSON mode was already false, we'll break and try the next model
        }
      }
    }

    throw lastError || new Error("All candidate OpenRouter models failed to process the request.");
  }
}
