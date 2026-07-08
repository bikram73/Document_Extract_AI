import { Handler } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initializer for GoogleGenAI to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it via Netlify Environment Variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
    });
  }
  return aiClient;
}

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing body" }),
      };
    }

    const { base64Data, mimeType, fileName } = JSON.parse(event.body);

    if (!base64Data || !mimeType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing document data or mimeType" }),
      };
    }

    const ai = getAiClient();

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const promptText = `
Analyze this business document (invoice, receipt, or purchase order) and extract all structured data according to the requested JSON schema.
Ensure to perform arithmetic totals verification (does subtotal + tax equal total?) and validate dates.
Provide high-quality confidence scores between 0 and 100 for extracted blocks.
Also, provide an 'insights' description summarizing what the document is, which vendor, date, and any interesting findings (e.g. tax rate differences, recurring patterns).
If there is an address mismatch or other potential alerts, put them in the 'alerts' array.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
      throw new Error("Empty response from Gemini extraction model");
    }

    const extractedData = JSON.parse(text);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true, data: extractedData, rawResponse: text }),
    };
  } catch (error: any) {
    console.error("Netlify Function Extraction error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error: error.message || "An error occurred during extraction.",
      }),
    };
  }
};
