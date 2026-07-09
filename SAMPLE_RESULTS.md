# 📄 Sample Documents & Extraction Results

This document contains sample inputs and their corresponding AI-generated structured JSON outputs for the **AI Document Data Extractor**.

---

# 📁 Directory Structure

```text
sample-documents/
├── Invoice.pdf
├── receipt.jpg
└── Purchase_order.png

sample-output/
├── invoice.json
├── receipt.json
└── purchase_order.json
```

---

# 📑 Sample 1 — Invoice

## Input Document

📄 **File:** `sample-documents/Invoice.pdf`

> Click below to download/view the sample invoice.

[📄 View Invoice](sample-documents/Invoice.pdf)

---

## Extracted JSON

📄 **File:** `sample-output/invoice.json`

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
assets/Purchase_order.png
```

Then display it like this:

<img src="sample-documents/Purchase_order.png" width="700"/>

---

## Extracted JSON

📄 **File:** `sample-output/purchase_order.json`

```json
{
  "... purchase order json here ..."
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
  "... receipt json here ..."
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
  "... receipt json here ..."
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
