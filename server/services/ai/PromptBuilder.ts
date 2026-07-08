export const DOCUMENT_JSON_SCHEMA_PROMPT = `
You must return a valid JSON object matching the following schema exactly. Do not include any markdown formatting (like \`\`\`json) or wrapping text outside the JSON object itself, just raw JSON.

Schema requirements:
{
  "documentType": string (Must be one of: "Invoice", "Receipt", "Purchase Order", or "Document"),
  "vendorName": string (Extracted vendor or seller name),
  "vendorTaxId": string (Tax ID or VAT ID of the vendor, if present, or null),
  "invoiceNumber": string (Invoice number, receipt ID, or purchase order number),
  "issueDate": string (Date of issue or purchase),
  "dueDate": string (Payment due date if invoice, or null),
  "currency": string (Currency code like USD, EUR, GBP or symbol like $),
  "paymentTerms": string (Payment terms e.g. Net 30, Due on Receipt, if present, or null),
  "financials": {
    "subtotal": number (Subtotal amount before tax),
    "tax": number (Tax amount),
    "total": number (Grand total amount)
  },
  "lineItems": Array of objects:
    [
      {
        "description": string (Description of item/service),
        "qty": number (Quantity of items),
        "unitPrice": number (Price per unit),
        "amount": number (Total amount for this item)
      }
    ],
  "confidence": {
    "overall": number (0-100 overall confidence score),
    "vendor": number (0-100 vendor match confidence score),
    "date": number (0-100 date match confidence score),
    "lineItems": number (0-100 line items match confidence score),
    "currency": number (0-100 currency match confidence score)
  },
  "insights": string (Short contextual paragraph summarizing what the document is, which vendor, date, and key findings/insights),
  "integrityCheck": {
    "dateValidation": string ("PASSED" or "FAILED"),
    "arithmeticTotal": string ("PASSED" or "FAILED"),
    "currencyConsistency": string ("PASSED" or "FAILED")
  },
  "alerts": Array of objects:
    [
      {
        "title": string (E.g. "Address Mismatch", "Unrecognized Fee"),
        "message": string (Details of the warning/alert)
      }
    ]
}

Instructions:
1. Analyze this business document carefully.
2. Ensure you perform arithmetic verification (does subtotal + tax equal total?) and validate dates (e.g. is issue date before or equal to due date?). Reflect these validations in the 'integrityCheck' object.
3. Provide high-quality confidence scores between 0 and 100 for extracted blocks.
4. If there is an address mismatch, weird fees, or other anomalies, describe them in the 'alerts' array.
`;

export function buildPrompt(): string {
  return `
Analyze this business document (invoice, receipt, or purchase order) and extract all structured data.
Ensure to perform arithmetic totals verification (does subtotal + tax equal total?) and validate dates.
Provide high-quality confidence scores between 0 and 100 for extracted blocks.
Also, provide an 'insights' description summarizing what the document is, which vendor, date, and any interesting findings.

${DOCUMENT_JSON_SCHEMA_PROMPT}
`;
}
