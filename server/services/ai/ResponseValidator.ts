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

/**
 * Robustly extracts the first valid JSON object sequence from any wrapping text or markdown blocks.
 */
function extractJsonString(rawText: string): string {
  let cleanText = rawText.trim();

  const firstBrace = cleanText.indexOf("{");
  const lastBrace = cleanText.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleanText.substring(firstBrace, lastBrace + 1);
  }

  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```[a-zA-Z]*\s*/, "");
    cleanText = cleanText.replace(/\s*```$/, "");
  }
  return cleanText.trim();
}

/**
 * Searches an object for possible key aliases in a case-insensitive, symbol-ignoring way.
 */
function getAliasValue(obj: any, keys: string[]): any {
  if (!obj || typeof obj !== "object") return undefined;

  // Direct exact match
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key];
  }

  // Normalized search
  const objKeys = Object.keys(obj);
  for (const key of keys) {
    const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const objKey of objKeys) {
      const lowerObjKey = objKey.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (lowerKey === lowerObjKey && obj[objKey] !== undefined) {
        return obj[objKey];
      }
    }
  }
  return undefined;
}

export function validateResponse(rawText: string): ExtractedData {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty or invalid response type received.");
  }

  const jsonString = extractJsonString(rawText);

  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e: any) {
    throw new Error(`Failed to parse JSON: ${e.message}. Raw segment: ${rawText.substring(0, 150)}...`);
  }

  // Map and normalize keys dynamically using aliases to handle any variance in model outputs
  const documentType = getAliasValue(parsed, ["documentType", "document_type", "type", "docType", "doc_type"]);
  const vendorName = getAliasValue(parsed, ["vendorName", "vendor_name", "vendor", "merchantName", "merchant_name", "merchant", "sellerName", "seller_name", "seller"]);
  
  // Normalize financials
  let financialsObj = getAliasValue(parsed, ["financials", "financial", "totals", "amounts", "summary"]);
  if (!financialsObj || typeof financialsObj !== "object") {
    financialsObj = {};
  }

  let totalValue = getAliasValue(financialsObj, ["total", "total_amount", "totalAmount", "grand_total", "grandTotal", "amount"]);
  if (totalValue === undefined) {
    totalValue = getAliasValue(parsed, ["total", "total_amount", "totalAmount", "grand_total", "grandTotal", "amount"]);
  }

  let subtotalValue = getAliasValue(financialsObj, ["subtotal", "sub_total", "subtotalAmount", "subtotal_amount"]);
  if (subtotalValue === undefined) {
    subtotalValue = getAliasValue(parsed, ["subtotal", "sub_total", "subtotalAmount", "subtotal_amount"]);
  }

  let taxValue = getAliasValue(financialsObj, ["tax", "tax_amount", "taxAmount", "vat", "vat_amount", "vatAmount"]);
  if (taxValue === undefined) {
    taxValue = getAliasValue(parsed, ["tax", "tax_amount", "taxAmount", "vat", "vat_amount", "vatAmount"]);
  }

  // Construct normalized final structure
  const normalized: any = {
    documentType: typeof documentType === "string" ? documentType : "Document",
    vendorName: typeof vendorName === "string" ? vendorName : "Unknown Vendor",
    vendorTaxId: getAliasValue(parsed, ["vendorTaxId", "vendor_tax_id", "taxId", "tax_id", "vatId", "vat_id", "vendorVat", "vendor_vat"]) || null,
    invoiceNumber: getAliasValue(parsed, ["invoiceNumber", "invoice_number", "invoiceNo", "invoice_no", "receiptNo", "receipt_no", "receiptNumber", "receipt_number", "poNumber", "po_number", "orderNumber", "order_number"]) || null,
    issueDate: getAliasValue(parsed, ["issueDate", "issue_date", "date", "invoiceDate", "invoice_date", "receiptDate", "receipt_date"]) || null,
    dueDate: getAliasValue(parsed, ["dueDate", "due_date"]) || null,
    currency: getAliasValue(parsed, ["currency", "currency_code", "currencyCode"]) || null,
    paymentTerms: getAliasValue(parsed, ["paymentTerms", "payment_terms", "terms"]) || null,
    financials: {
      subtotal: subtotalValue !== undefined ? Number(subtotalValue) : undefined,
      tax: taxValue !== undefined ? Number(taxValue) : undefined,
      total: totalValue !== undefined ? Number(totalValue) : 0,
    },
    lineItems: [],
    confidence: { overall: 85 },
    insights: getAliasValue(parsed, ["insights", "insight", "summary", "description"]) || "Extracted document data.",
    integrityCheck: {
      dateValidation: "PASSED",
      arithmeticTotal: "PASSED",
      currencyConsistency: "PASSED",
    },
    alerts: [],
  };

  // Ensure overall total is parsed as a valid number
  if (isNaN(normalized.financials.total)) {
    normalized.financials.total = 0;
  }

  // Handle line items
  const lineItemsRaw = getAliasValue(parsed, ["lineItems", "line_items", "items", "details"]);
  if (lineItemsRaw && Array.isArray(lineItemsRaw)) {
    normalized.lineItems = lineItemsRaw.map((item: any, idx: number) => {
      const desc = getAliasValue(item, ["description", "desc", "name", "item"]);
      const qty = getAliasValue(item, ["qty", "quantity", "count"]);
      const unitPrice = getAliasValue(item, ["unitPrice", "unit_price", "price", "rate"]);
      const amount = getAliasValue(item, ["amount", "total", "line_total", "lineTotal"]);

      const parsedAmount = amount !== undefined ? Number(amount) : 0;
      return {
        description: typeof desc === "string" ? desc : `Item #${idx + 1}`,
        qty: qty !== undefined ? Number(qty) : 1,
        unitPrice: unitPrice !== undefined ? Number(unitPrice) : parsedAmount,
        amount: parsedAmount,
      };
    });
  }

  // Handle confidence
  const confidenceRaw = getAliasValue(parsed, ["confidence", "confidence_scores", "confidenceScores"]);
  if (confidenceRaw && typeof confidenceRaw === "object") {
    normalized.confidence = {
      overall: Number(getAliasValue(confidenceRaw, ["overall", "score"])) || 85,
      vendor: Number(getAliasValue(confidenceRaw, ["vendor", "vendor_score", "vendorScore"])) || undefined,
      date: Number(getAliasValue(confidenceRaw, ["date", "date_score", "dateScore"])) || undefined,
      lineItems: Number(getAliasValue(confidenceRaw, ["lineItems", "line_items", "lineItemsScore"])) || undefined,
      currency: Number(getAliasValue(confidenceRaw, ["currency", "currency_score", "currencyScore"])) || undefined,
    };
  }

  // Handle integrity check
  const integrityRaw = getAliasValue(parsed, ["integrityCheck", "integrity_check", "checks", "validation"]);
  if (integrityRaw && typeof integrityRaw === "object") {
    normalized.integrityCheck = {
      dateValidation: getAliasValue(integrityRaw, ["dateValidation", "date_validation", "date"]) || "PASSED",
      arithmeticTotal: getAliasValue(integrityRaw, ["arithmeticTotal", "arithmetic_total", "arithmetic", "total"]) || "PASSED",
      currencyConsistency: getAliasValue(integrityRaw, ["currencyConsistency", "currency_consistency", "currency"]) || "PASSED",
    };
  }

  // Handle alerts
  const alertsRaw = getAliasValue(parsed, ["alerts", "warnings", "errors"]);
  if (alertsRaw && Array.isArray(alertsRaw)) {
    normalized.alerts = alertsRaw
      .map((alert: any) => {
        const title = getAliasValue(alert, ["title", "name", "type"]);
        const message = getAliasValue(alert, ["message", "desc", "details"]);
        if (title && message) {
          return { title: String(title), message: String(message) };
        }
        return null;
      })
      .filter((a: any) => a !== null);
  }

  return normalized as ExtractedData;
}

