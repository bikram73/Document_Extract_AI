import { AIService } from "./ProviderInterface";
import { ExtractedData, validateResponse } from "./ResponseValidator";
import { buildPrompt } from "./PromptBuilder";

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

    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
    const promptText = buildPrompt();

    // Prepare content payload
    const content: any[] = [{ type: "text", text: promptText }];

    // If it's an image or pdf, we send it as an image_url (OpenRouter supports standard OpenAI format)
    if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
      content.push({
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${base64Data}`,
        },
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://docextract-ai.netlify.app", // Optional header
        "X-Title": "DocExtract AI", // Optional header
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
      throw new Error(`OpenRouter API failed with status ${response.status}: ${errText}`);
    }

    const payload: any = await response.json();
    const rawText = payload.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error("No response text found in OpenRouter choices payload.");
    }

    return validateResponse(rawText);
  }
}
