import pdfModule from "pdf-parse";

// Robustly resolve the main pdf-parse function depending on ES/CommonJS interop wrapper
const pdf = typeof pdfModule === "function" ? pdfModule : ((pdfModule as any).default || pdfModule);

/**
 * Extracts raw text content from a base64 encoded PDF file.
 */
export async function extractTextFromPdf(base64Data: string): Promise<string> {
  try {
    if (typeof pdf !== "function") {
      throw new Error("pdf-parse module could not be resolved to a function. Resolved to: " + typeof pdf);
    }
    const buffer = Buffer.from(base64Data, "base64");
    const data = await pdf(buffer);
    return data.text || "";
  } catch (error: any) {
    console.error("[PdfParser] Failed to extract text from PDF:", error);
    throw new Error(`Failed to parse PDF document: ${error.message || error}`);
  }
}
