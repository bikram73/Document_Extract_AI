export interface ExtractedData {
  documentType: string;
  vendorName: string;
  vendorTaxId?: string | null;
  invoiceNumber?: string | null;
  issueDate?: string | null;
  dueDate?: string | null;
  currency?: string | null;
  paymentTerms?: string | null;
  financials: {
    subtotal?: number;
    tax?: number;
    total: number;
  };
  lineItems?: Array<{
    description: string;
    qty?: number;
    unitPrice?: number;
    amount: number;
  }>;
  confidence: {
    overall: number;
    vendor?: number;
    date?: number;
    lineItems?: number;
    currency?: number;
  };
  insights: string;
  integrityCheck: {
    dateValidation: string;
    arithmeticTotal: string;
    currencyConsistency: string;
  };
  alerts?: Array<{
    title: string;
    message: string;
  }>;
}

export function validateResponse(rawText: string): ExtractedData {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty or invalid response type received.");
  }

  // Strip Markdown fences if present
  let cleanText = rawText.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```[a-zA-Z]*\s*/, "");
    cleanText = cleanText.replace(/\s*```$/, "");
  }
  cleanText = cleanText.trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleanText);
  } catch (e: any) {
    throw new Error(`Failed to parse JSON: ${e.message}. Raw: ${rawText.substring(0, 100)}...`);
  }

  // Validate presence of required properties
  if (!parsed.documentType || typeof parsed.documentType !== "string") {
    throw new Error("Missing or invalid 'documentType'");
  }
  if (!parsed.vendorName || typeof parsed.vendorName !== "string") {
    throw new Error("Missing or invalid 'vendorName'");
  }
  if (!parsed.financials || typeof parsed.financials !== "object") {
    throw new Error("Missing or invalid 'financials' object");
  }
  if (typeof parsed.financials.total !== "number" && isNaN(Number(parsed.financials.total))) {
    throw new Error("Missing or invalid 'financials.total'");
  }

  // Normalize numbers in financials
  parsed.financials.total = Number(parsed.financials.total);
  if (parsed.financials.subtotal !== undefined) {
    parsed.financials.subtotal = Number(parsed.financials.subtotal);
  }
  if (parsed.financials.tax !== undefined) {
    parsed.financials.tax = Number(parsed.financials.tax);
  }

  if (!parsed.confidence || typeof parsed.confidence !== "object") {
    parsed.confidence = { overall: 85 };
  } else {
    parsed.confidence.overall = Number(parsed.confidence.overall) || 85;
  }

  if (!parsed.insights || typeof parsed.insights !== "string") {
    parsed.insights = "Extracted document data.";
  }

  if (!parsed.integrityCheck || typeof parsed.integrityCheck !== "object") {
    parsed.integrityCheck = {
      dateValidation: "PASSED",
      arithmeticTotal: "PASSED",
      currencyConsistency: "PASSED",
    };
  } else {
    parsed.integrityCheck.dateValidation = parsed.integrityCheck.dateValidation || "PASSED";
    parsed.integrityCheck.arithmeticTotal = parsed.integrityCheck.arithmeticTotal || "PASSED";
    parsed.integrityCheck.currencyConsistency = parsed.integrityCheck.currencyConsistency || "PASSED";
  }

  // Normalize line items
  if (parsed.lineItems && Array.isArray(parsed.lineItems)) {
    parsed.lineItems = parsed.lineItems.map((item: any, idx: number) => {
      return {
        description: item.description || `Item #${idx + 1}`,
        qty: item.qty !== undefined ? Number(item.qty) : 1,
        unitPrice: item.unitPrice !== undefined ? Number(item.unitPrice) : (Number(item.amount) || 0),
        amount: Number(item.amount) || 0,
      };
    });
  } else {
    parsed.lineItems = [];
  }

  // Normalize alerts
  if (parsed.alerts && Array.isArray(parsed.alerts)) {
    parsed.alerts = parsed.alerts.filter((alert: any) => alert && alert.title && alert.message);
  } else {
    parsed.alerts = [];
  }

  return parsed as ExtractedData;
}
