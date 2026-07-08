import { AIService } from "./ProviderInterface";
import { ExtractedData, validateResponse } from "./ResponseValidator";
import { buildPrompt } from "./PromptBuilder";

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

    const model = process.env.GROQ_MODEL || "llama-3.2-11b-vision-preview";
    const promptText = buildPrompt();

    // Prepare content payload
    const content: any[] = [{ type: "text", text: promptText }];

    // Groq's standard chat completions image_url does not natively support PDF binary inputs.
    if (mimeType === "application/pdf") {
      throw new Error("Groq does not support native PDF inputs via image_url. Please use Google Gemini or upload an image format (PNG, JPEG, WEBP).");
    }

    // If it's an image, we send it as an image_url (Groq vision model format)
    if (mimeType.startsWith("image/")) {
      content.push({
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${base64Data}`,
        },
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API failed with status ${response.status}: ${errText}`);
    }

    const payload: any = await response.json();
    const rawText = payload.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error("No response text found in Groq choices payload.");
    }

    return validateResponse(rawText);
  }
}
