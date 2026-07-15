# 📊 DocExtract AI — Technical Report

## Project Summary

DocExtract AI is a full-stack AI-powered document extraction platform capable of converting invoices, receipts, purchase orders, and business documents into structured JSON using OCR and Large Language Models.

The application combines OCR, multiple AI providers, validation logic, and an interactive user interface to simplify document understanding.

---

# Technology Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Motion
- Lucide React

---

## Backend

- Node.js
- Express
- TypeScript

---

## OCR Engine

- Tesseract.js
- pdf.js

---

## AI Providers

Primary

- Google Gemini

Fallback

- OpenRouter

Emergency

- Groq

---

# Runtime Environment

| Component | Runtime |
|------------|----------|
| Frontend | React + Vite |
| Backend | Node.js |
| OCR | Browser |
| AI | Cloud APIs |
| API | Express |

---

# AI Processing Pipeline

```text
Upload

↓

OCR

↓

Prompt Builder

↓

Gemini

↓

OpenRouter (Fallback)

↓

Groq (Fallback)

↓

Validation

↓

Structured JSON
```

---

# Validation Strategy

The extracted data is verified using multiple checks.

## Date Validation

Ensures

Issue Date ≤ Due Date

---

## Arithmetic Validation

Verifies

Subtotal + Tax = Total

---

## Currency Validation

Ensures all monetary fields use the same currency.

---

## Missing Field Validation

Missing values become

```json
null
```

instead of hallucinated values.

---

# Confidence Scores

The system calculates confidence for:

- Overall Extraction
- Vendor Information
- Dates
- Line Items
- Currency

Confidence scores help users understand extraction reliability.

---

# Performance

Average processing time

| Stage | Time |
|---------|---------|
| OCR | 1–2 sec |
| AI Extraction | 1–3 sec |
| Validation | <100 ms |
| Total | 1.5–4 sec |

---

# Resource Usage

Typical browser memory

- 120–250 MB

Backend memory

- Depends on uploaded document size

Maximum upload size

- 10 MB

---

# Error Handling

The application includes:

- Automatic provider fallback
- Retry logic
- API timeout handling
- Validation failure handling
- Invalid JSON recovery

---

# Known Limitations

- Internet connection required
- Cloud AI APIs required
- OCR accuracy decreases for blurry documents
- Handwritten documents are difficult to recognize
- Very large tables may reduce extraction quality

---

# Privacy & Security

- API keys stored securely in environment variables
- No API keys exposed to users
- Uploaded documents processed only during extraction
- No permanent document storage
- JSON generated on demand

---

# Testing

The application has been manually tested with:

✅ Invoices

✅ Receipts

✅ Purchase Orders

Different document layouts

Different image resolutions

Scanned documents

Digital PDFs

---

# Future Enhancements

- Local AI models
- ONNX runtime support
- Offline document extraction
- Batch document processing
- Database integration
- User authentication
- Multi-language OCR
- Fine-tuned extraction models

---

# Attribution

This project uses the following technologies:

- React
- Vite
- TypeScript
- Node.js
- Express
- Tailwind CSS
- Tesseract.js
- pdf.js
- Google Gemini API
- OpenRouter API
- Groq API
- Lucide React
- Motion

---

# Conclusion

DocExtract AI demonstrates how OCR, modern web technologies, validation logic, and multiple Large Language Models can be combined to build a reliable document extraction system capable of handling real-world business documents while providing structured JSON output, confidence scoring, and intelligent fallback mechanisms.
