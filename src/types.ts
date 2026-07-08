export type ActiveTab = "home" | "upload" | "analyzing" | "results" | "analytics";

export interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface Financials {
  subtotal?: number;
  tax?: number;
  total: number;
}

export interface Confidence {
  overall: number;
  vendor: number;
  date: number;
  lineItems: number;
  currency: number;
}

export interface IntegrityCheck {
  dateValidation: string; // "PASSED" | "FAILED"
  arithmeticTotal: string; // "PASSED" | "FAILED"
  currencyConsistency: string; // "PASSED" | "FAILED"
}

export interface Alert {
  title: string;
  message: string;
}

export interface ExtractedData {
  documentType: string; // "Invoice" | "Receipt" | "Purchase Order" | "Document"
  vendorName: string;
  vendorTaxId?: string;
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  currency?: string;
  paymentTerms?: string;
  financials: Financials;
  lineItems?: LineItem[];
  confidence: Confidence;
  insights: string;
  integrityCheck: IntegrityCheck;
  alerts?: Alert[];
}

export interface ActiveFile {
  name: string;
  size: string;
  base64Data: string;
  mimeType: string;
  isCustom?: boolean;
}

// Default pre-populated sample values for high fidelity demonstration
export const SAMPLE_INVOICE_DATA: ExtractedData = {
  documentType: "Service Invoice",
  vendorName: "Stripe Payments UK",
  vendorTaxId: "GB 123 456 789",
  invoiceNumber: "INV-2024-88412",
  issueDate: "Oct 24, 2024",
  dueDate: "Nov 23, 2024",
  currency: "USD ($)",
  paymentTerms: "Net 30",
  financials: {
    subtotal: 1995.00,
    tax: 399.00,
    total: 2394.00,
  },
  lineItems: [
    {
      description: "AI Document Processing (Enterprise)",
      qty: 1,
      unitPrice: 1200.00,
      amount: 1200.00,
    },
    {
      description: "Custom API Integration Support",
      qty: 5,
      unitPrice: 150.00,
      amount: 750.00,
    },
    {
      description: "Monthly Cloud Storage Surcharge",
      qty: 1,
      unitPrice: 45.00,
      amount: 45.00,
    },
  ],
  confidence: {
    overall: 95,
    vendor: 99,
    date: 97,
    lineItems: 84,
    currency: 100,
  },
  insights: "This document appears to be a Service Invoice from Stripe Payments UK dated October 24, 2024. The billing cycle matches your previous Q3 subscriptions, though the tax rate is 0.5% higher due to recent regional adjustments.",
  integrityCheck: {
    dateValidation: "PASSED",
    arithmeticTotal: "PASSED",
    currencyConsistency: "PASSED",
  },
  alerts: [
    {
      title: "Address Mismatch",
      message: "The vendor address on invoice differs from the Master Data record. Recommended: Update CRM record.",
    },
  ],
};
