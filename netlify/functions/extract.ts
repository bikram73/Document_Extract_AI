import { Handler } from "@netlify/functions";
import { FallbackManager } from "../../server/services/ai/FallbackManager";

const fallbackManager = new FallbackManager();

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

    const result = await fallbackManager.extractWithFallback(base64Data, mimeType);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        data: result.data,
        providerUsed: result.providerUsed,
        providerReason: result.providerReason,
        providerLogs: result.providerLogs,
      }),
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
