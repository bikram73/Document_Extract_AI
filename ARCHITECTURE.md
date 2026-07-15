# 🏗️ DocExtract AI — System Architecture

## Overview

DocExtract AI is a full-stack AI-powered document extraction system designed to convert invoices, receipts, purchase orders, and similar business documents into validated, structured JSON.

The application combines OCR, intelligent document parsing, multiple LLM providers, and validation logic to improve extraction accuracy and reliability.

---

# High-Level Architecture

```text
                     ┌────────────────────────┐
                     │      User Upload       │
                     │ PDF / Image Document   │
                     └────────────┬───────────┘
                                  │
                                  ▼
                  ┌────────────────────────────────┐
                  │ Client-side Pre-processing     │
                  │                                │
                  │ • pdf.js                       │
                  │ • Tesseract.js OCR            │
                  │ • Image Processing            │
                  └────────────┬───────────────────┘
                               │
                               ▼
                  ┌────────────────────────────────┐
                  │ React Frontend                 │
                  │                                │
                  │ Upload Interface               │
                  │ Progress Screen                │
                  │ Results Dashboard              │
                  │ Spreadsheet Editor             │
                  └────────────┬───────────────────┘
                               │
                               ▼
                  ┌────────────────────────────────┐
                  │ Express Backend API            │
                  │                                │
                  │ POST /api/extract             │
                  │ Health Check API              │
                  └────────────┬───────────────────┘
                               │
                               ▼
               ┌────────────────────────────────────────┐
               │ Intelligent AI Provider Manager         │
               │                                        │
               │ 1. Google Gemini                       │
               │ 2. OpenRouter                          │
               │ 3. Groq                                │
               └────────────┬───────────────────────────┘
                            │
                            ▼
             ┌──────────────────────────────────────────┐
             │ Response Validation Engine               │
             │                                          │
             │ • JSON Validation                        │
             │ • Date Validation                        │
             │ • Arithmetic Validation                  │
             │ • Currency Validation                    │
             │ • Missing Field Handling                 │
             └────────────┬─────────────────────────────┘
                          │
                          ▼
             ┌──────────────────────────────────────────┐
             │ Structured JSON Output                   │
             │                                          │
             │ Confidence Scores                        │
             │ Alerts                                   │
             │ Integrity Checks                         │
             └──────────────────────────────────────────┘
```

---

# Processing Pipeline

## Step 1 — Document Upload

Supported formats

- PDF
- PNG
- JPG
- JPEG
- WEBP

Maximum upload size

- 10 MB

---

## Step 2 — OCR & Text Extraction

Depending on the document type:

### Digital PDFs

Uses **pdf.js** to extract selectable text.

### Scanned Images

Uses **Tesseract.js** OCR to recognize printed text.

---

## Step 3 — Backend Processing

The extracted content is securely sent to the Express backend.

Responsibilities:

- API authentication
- Request validation
- AI provider selection
- Error handling
- Logging

---

## Step 4 — Multi-Provider AI Extraction

The backend attempts extraction using providers in priority order.

### Primary

Google Gemini

↓

### Secondary

OpenRouter

↓

### Emergency Fallback

Groq

Automatic failover occurs whenever a provider becomes unavailable or exceeds quota.

---

## Step 5 — Validation Engine

The extracted JSON is validated before returning to the frontend.

Validation includes:

- Required field verification
- Date validation
- Arithmetic verification
- Currency consistency
- Missing values converted to null

---

## Step 6 — Interactive Results

Users can:

- View structured JSON
- Edit extracted fields
- Download JSON
- Export CSV
- View confidence scores
- Review validation alerts

---

# Design Decisions

## React

Chosen for:

- Component-based architecture
- Fast rendering
- Excellent ecosystem

---

## TypeScript

Used to provide:

- Type safety
- Better maintainability
- Improved IDE support

---

## Express.js

Provides

- REST APIs
- Secure API key management
- Backend routing

---

## Gemini

Primary extraction engine because of:

- Strong document understanding
- High-quality structured output

---

## OpenRouter

Used as secondary provider because:

- High availability
- Multiple model support
- Provider redundancy

---

## Groq

Used as emergency fallback because:

- Very low latency
- Fast inference
- Reliable backup provider

---

# Security Considerations

- API keys stored in environment variables
- Keys never exposed to the frontend
- File validation before processing
- Request size limits
- Backend-only AI communication

---

# Current Limitations

- Requires internet connection for AI inference
- Handwritten documents may reduce OCR accuracy
- Extremely blurry images may produce incomplete results
- Very complex multi-page tables may reduce extraction accuracy

---

# Future Improvements

- Local LLM support
- On-device inference
- Multi-page PDF understanding
- Database storage
- User authentication
- Batch document processing
- Document comparison
- Multi-language extraction
