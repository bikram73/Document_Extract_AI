import { GoogleGenAI, Type } from "@google/genai";
import { AIService } from "./ProviderInterface";
import { ExtractedData, validateResponse } from "./ResponseValidator";
import { buildPrompt } from "./PromptBuilder";

export class GeminiService implements AIService {
  name = "gemini";
  private client: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
      }
      this.client = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return this.client;
  }

  async healthCheck(): Promise<boolean> {
    return !!process.env.GEMINI_API_KEY;
  }

  async extractStructuredData(base64Data: string, mimeType: string): Promise<ExtractedData> {
    const serviceStartTime = Date.now();
    const ai = this.getClient();
    
    // De-duplicate candidate models to fall back through in case of rate limits or service unavailability
    const candidateModels = Array.from(
      new Set(
        [
          process.env.GEMINI_MODEL,
          "gemini-3.5-flash",
          "gemini-3.1-flash-lite",
          "gemini-3.1-pro-preview",
        ].filter(Boolean)
      )
    ) as string[];

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const promptText = buildPrompt();
    let lastError: any = null;
    let quotaExceededEncountered = false;

    for (const model of candidateModels) {
      if (quotaExceededEncountered) {
        break;
      }
      // Guard: If we've already spent more than 8 seconds, don't try any more models
      const totalElapsedMs = Date.now() - serviceStartTime;
      if (totalElapsedMs > 8000) {
        console.warn(`[GeminiService] ${totalElapsedMs}ms elapsed. Aborting candidate models search to avoid 504 gateway timeout.`);
        break;
      }

      // Retry up to 2 times only for transient 503 errors.
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          // Inner guard: prevent starting another request if we are running close to timeout
          if (Date.now() - serviceStartTime > 9500) {
            break;
          }

          console.log(`[GeminiService] Trying extraction with model: ${model} (attempt ${attempt}/${2})`);
          
          const response = await ai.models.generateContent({
            model: model,
            contents: [imagePart, { text: promptText }],
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  documentType: {
                    type: Type.STRING,
                    description: "Must be one of: 'Invoice', 'Receipt', 'Purchase Order', or 'Document'",
                  },
                  vendorName: {
                    type: Type.STRING,
                    description: "Extracted vendor or seller name",
                  },
                  vendorTaxId: {
                    type: Type.STRING,
                    description: "Tax ID or VAT ID of the vendor, if present",
                  },
                  invoiceNumber: {
                    type: Type.STRING,
                    description: "Invoice number, receipt ID, or purchase order number",
                  },
                  issueDate: {
                    type: Type.STRING,
                    description: "Date of issue or purchase",
                  },
                  dueDate: {
                    type: Type.STRING,
                    description: "Payment due date if invoice",
                  },
                  currency: {
                    type: Type.STRING,
                    description: "Currency code (e.g., USD, EUR, GBP) or symbol",
                  },
                  paymentTerms: {
                    type: Type.STRING,
                    description: "Payment terms (e.g. Net 30, Due on Receipt), if present",
                  },
                  financials: {
                    type: Type.OBJECT,
                    properties: {
                      subtotal: { type: Type.NUMBER },
                      tax: { type: Type.NUMBER },
                      total: { type: Type.NUMBER },
                    },
                    required: ["total"],
                  },
                  lineItems: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        description: { type: Type.STRING },
                        qty: { type: Type.NUMBER },
                        unitPrice: { type: Type.NUMBER },
                        amount: { type: Type.NUMBER },
                      },
                      required: ["description", "amount"],
                    },
                  },
                  confidence: {
                    type: Type.OBJECT,
                    properties: {
                      overall: { type: Type.NUMBER, description: "Overall confidence percentage (0-100)" },
                      vendor: { type: Type.NUMBER, description: "Vendor match confidence percentage (0-100)" },
                      date: { type: Type.NUMBER, description: "Date match confidence percentage (0-100)" },
                      lineItems: { type: Type.NUMBER, description: "Line items match confidence percentage (0-100)" },
                      currency: { type: Type.NUMBER, description: "Currency match confidence percentage (0-100)" },
                    },
                    required: ["overall"],
                  },
                  insights: {
                    type: Type.STRING,
                    description: "Short contextual paragraph summarizing the document type, vendor, date, and key findings.",
                  },
                  integrityCheck: {
                    type: Type.OBJECT,
                    properties: {
                      dateValidation: { type: Type.STRING, description: "PASSED or FAILED" },
                      arithmeticTotal: { type: Type.STRING, description: "PASSED or FAILED" },
                      currencyConsistency: { type: Type.STRING, description: "PASSED or FAILED" },
                    },
                    required: ["dateValidation", "arithmeticTotal", "currencyConsistency"],
                  },
                  alerts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING, description: "E.g., 'Address Mismatch', 'Unrecognized Fee'" },
                        message: { type: Type.STRING, description: "Details of the alert warning" },
                      },
                      required: ["title", "message"],
                    },
                  },
                },
                required: ["documentType", "vendorName", "financials", "confidence", "insights", "integrityCheck"],
              },
            },
          });

          const text = response.text;
          if (!text) {
            throw new Error(`Empty response received from Gemini model ${model}.`);
          }

          console.log(`[GeminiService] Successfully extracted data using model: ${model}`);
          return validateResponse(text);
        } catch (err: any) {
          lastError = err;
          const status = err.status || err.statusCode || (err.error && err.error.code);
          
          const isQuotaExceeded = 
            status === 429 || 
            (err.message && (
              err.message.includes("429") || 
              err.message.includes("quota") || 
              err.message.includes("Quota") || 
              err.message.includes("RESOURCE_EXHAUSTED") || 
              err.message.includes("limit") || 
              err.message.includes("exceeded")
            ));

          const isTransient = 
            status === 503 || 
            (err.message && (
              err.message.includes("503") || 
              err.message.includes("demand") || 
              err.message.includes("UNAVAILABLE") ||
              err.message.includes("overloaded")
            ));

          console.warn(`[GeminiService] Model ${model} attempt ${attempt} failed:`, err.message || err);

          if (isQuotaExceeded) {
            console.log(`[GeminiService] Quota or rate limit exceeded on ${model}. Skipping all other Gemini models to fail fast.`);
            quotaExceededEncountered = true;
            // Break the retry loop immediately for 429 quota errors to let other models / sandbox handle it
            break;
          }

          if (isTransient && attempt < 2) {
            // Wait 500ms (shorter sleep to avoid gateway timeouts) before retrying the same model
            console.log(`[GeminiService] Transient 503 error detected. Retrying model ${model} in 500ms...`);
            await new Promise((resolve) => setTimeout(resolve, 500));
          } else {
            // Move to the next candidate model
            break;
          }
        }
      }
    }

    throw new Error(`All candidate Gemini models failed to process the request. Last error: ${lastError?.message || JSON.stringify(lastError)}`);
  }
}
