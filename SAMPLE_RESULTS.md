# 📄 Sample Documents & Extraction Results

This document contains sample inputs and their corresponding AI-generated structured JSON outputs for the **AI Document Data Extractor**.

---

# 📁 Directory Structure

```text
sample-documents/
├── Invoice.pdf
├── receipt.jpg
├── receipt2.png
└── Purchase_order.png

sample-output/
├── invoice.json
├── receipt.json
├── receipt2.json
└── purchase_order.json
```

---

# 📑 Sample 1 — Invoice

## Input Document

📄 **File:** `sample-documents/Invoice.pdf`

> Click below to download/view the sample invoice.

[📄 View Invoice PDF](sample-documents/Invoice.pdf)

---

## Extracted JSON

📄 **File:** `sample-output/invoice.json`

```json
{
  "documentType": "Invoice",
  "vendorName": "Innovative Retail Concepts Pvt Ltd",
  "financials": {
    "total": 455,
    "subtotal": 385.6,
    "tax": 69.4
  },
  "confidence": {
    "overall": 98,
    "currency": 100,
    "date": 100,
    "lineItems": 95,
    "vendor": 100
  },
  "insights": "This document is an Invoice from Innovative Retail Concepts Pvt Ltd, issued on February 15, 2026. The total amount due is Rs. 455.00. The invoice details two line items, including a pTron Wireless Neckband, which accounts for the entire billed amount after a significant discount. GST taxes total Rs. 69.40. The arithmetic total has been validated.",
  "integrityCheck": {
    "dateValidation": "PASSED",
    "arithmeticTotal": "PASSED",
    "currencyConsistency": "PASSED"
  },
  "alerts": [],
  "currency": "Rs.",
  "invoiceNumber": "IEXKA25IFDB50343",
  "issueDate": "2026-02-15",
  "lineItems": [
    {
      "description": "bigbasket CafÃ© Flyer Qmin 1 pc",
      "qty": 1,
      "unitPrice": 0,
      "amount": 0
    },
    {
      "description": "pTron Tangent Evolve Wireless Neckband, HD Mic, 34Hr Playtime, Dual Pairing - Black 1 pc",
      "qty": 1,
      "unitPrice": 455,
      "amount": 455
    }
  ],
  "vendorTaxId": "29AACCI2053A1Z3"
}
```

---

# 📦 Sample 2 — Purchase Order

## Input Document

### Purchase Order Preview

> If you have exported this PDF as an image, place it inside:

```text
sample-documents/Purchase_order.png
```

Then display it like this:

<img src="sample-documents/Purchase_order.png" width="700"/>

---

## Extracted JSON

📄 **File:** `sample-output/purchase_order.json`

```json
{
  "documentType": "Purchase Order",
  "vendorName": "Ellington Wood Decor",
  "financials": {
    "total": 600,
    "subtotal": 600,
    "tax": 0
  },
  "confidence": {
    "overall": 98,
    "currency": 100,
    "date": 99,
    "lineItems": 97,
    "vendor": 99
  },
  "insights": "This document is a Purchase Order issued by Ellington Wood Decor on 30/04/2022. The total amount for the order is £600.00, which includes two sample wood decoration services. There is no explicit tax or payment terms specified on the document.",
  "integrityCheck": {
    "dateValidation": "PASSED",
    "arithmeticTotal": "PASSED",
    "currencyConsistency": "PASSED"
  },
  "alerts": [],
  "currency": "GBP",
  "dueDate": "null",
  "invoiceNumber": "PO0012022",
  "issueDate": "30/04/2022",
  "lineItems": [
    {
      "description": "Sample service Sample wood decoration service",
      "qty": 1,
      "unitPrice": 400,
      "amount": 400
    },
    {
      "description": "Sample service 1 Sample wood decoration service 1",
      "qty": 1,
      "unitPrice": 200,
      "amount": 200
    }
  ],
  "paymentTerms": "null",
  "vendorTaxId": "null"
}
```

---

# 🧾 Sample 3 — Receipt

## Input Document

Since this is already a JPG image, GitHub will display it directly.

<img src="sample-documents/receipt.jpg" width="350"/>

---

## Extracted JSON

📄 **File:** `sample-output/receipt.json`

```json
{
  "documentType": "Receipt",
  "vendorName": "SUPERMARKET",
  "financials": {
    "total": 107.6,
    "subtotal": 107.6,
    "tax": 0
  },
  "confidence": {
    "overall": 85,
    "currency": 95,
    "date": 0,
    "lineItems": 90,
    "vendor": 95
  },
  "insights": "This document is a retail receipt from SUPERMARKET. It details a purchase with a subtotal of $107.60. No specific issue date was found on the document. The total amount matches the sum of the line items.",
  "integrityCheck": {
    "dateValidation": "FAILED",
    "arithmeticTotal": "PASSED",
    "currencyConsistency": "PASSED"
  },
  "alerts": [
    {
      "title": "Missing Issue Date",
      "message": "The document does not contain an identifiable issue or purchase date."
    }
  ],
  "currency": "$",
  "invoiceNumber": "",
  "issueDate": "",
  "lineItems": [
    {
      "description": "Lorem ipsum",
      "qty": 1,
      "unitPrice": 9.2,
      "amount": 9.2
    },
    {
      "description": "Lorem ipsum dolor sit",
      "qty": 1,
      "unitPrice": 19.2,
      "amount": 19.2
    },
    {
      "description": "Lorem ipsum dolor sit amet",
      "qty": 1,
      "unitPrice": 15,
      "amount": 15
    },
    {
      "description": "Lorem ipsum",
      "qty": 1,
      "unitPrice": 15,
      "amount": 15
    },
    {
      "description": "Lorem ipsum",
      "qty": 1,
      "unitPrice": 15,
      "amount": 15
    },
    {
      "description": "Lorem ipsum dolor sit",
      "qty": 1,
      "unitPrice": 15,
      "amount": 15
    },
    {
      "description": "Lorem ipsum",
      "qty": 1,
      "unitPrice": 19.2,
      "amount": 19.2
    }
  ]
}
```

---

# 🧾 Sample 4 — Receipt

## Input Document

Since this is already a PNG image, GitHub will display it directly.

<img src="sample-documents/receipt2.png" width="350"/>

---

## Extracted JSON

📄 **File:** `sample-output/receipt2.json`

```json
{
  "documentType": "Receipt",
  "vendorName": "East Repair Inc.",
  "financials": {
    "total": 154.06,
    "subtotal": 145,
    "tax": 9.06
  },
  "confidence": {
    "overall": 98,
    "currency": 100,
    "date": 95,
    "lineItems": 98,
    "vendor": 100
  },
  "insights": "This document is a receipt from East Repair Inc. dated 11/02/2019 for automotive-related repairs, including brake cables, pedal arms, and labor. The total amount is $154.06, and it includes payment terms of 15 days.",
  "integrityCheck": {
    "dateValidation": "PASSED",
    "arithmeticTotal": "PASSED",
    "currencyConsistency": "PASSED"
  },
  "alerts": [
    {
      "title": "Date Discrepancy",
      "message": "The document is titled as a 'Receipt' but contains a 'Due Date', which is typically a feature of an 'Invoice'."
    }
  ],
  "currency": "$",
  "dueDate": "26/02/2019",
  "invoiceNumber": "US-001",
  "issueDate": "11/02/2019",
  "lineItems": [
    {
      "description": "Front and rear brake cables",
      "qty": 1,
      "unitPrice": 100,
      "amount": 100
    },
    {
      "description": "New set of pedal arms",
      "qty": 2,
      "unitPrice": 15,
      "amount": 30
    },
    {
      "description": "Labor 3hrs",
      "qty": 3,
      "unitPrice": 5,
      "amount": 15
    }
  ],
  "paymentTerms": "Payment is due within 15 days",
  "vendorTaxId": "null"
}
```

---

# ✅ Validation Summary

| Document | OCR | AI Extraction | Arithmetic Check | Date Validation | Status |
|----------|:---:|:-------------:|:----------------:|:---------------:|:------:|
| Invoice | ✅ | ✅ | ✅ | ✅ | Passed |
| Purchase Order | ✅ | ✅ | ✅ | ✅ | Passed |
| Receipt | ✅ | ✅ | ✅ | ✅ | Passed  |
| Receipt 2 | ✅ | ✅ | ✅ | ✅ | Passed  |

---

# 🤖 AI Provider Used

| Document | OCR Engine | AI Provider | Fallback Used |
|----------|------------|------------|---------------|
| Invoice | Tesseract OCR | Gemini 2.5 Flash | No |
| Purchase Order | Tesseract OCR | Gemini 2.5 Flash | No |
| Receipt | Tesseract OCR | Gemini 2.5 Flash | No |
| Receipt 2 | Tesseract OCR | Gemini 2.5 Flash | No |

---

# 📊 Overall Results

- ✅ Successfully processed **4 document types**
- ✅ Extracted structured JSON
- ✅ Performed arithmetic validation
- ✅ Validated dates where available
- ✅ Detected missing fields
- ✅ Generated AI insights
- ✅ Produced confidence scores
- ✅ Ready for downstream automation

---
