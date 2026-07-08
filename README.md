# 📄 DocExtract AI — Intelligent Document Data Extraction Agent

DocExtract AI is an enterprise-grade web application and intelligent data extraction engine designed to convert unstructured physical documents—such as invoices, receipts, and purchase orders—into highly validated, structured JSON payloads. By combining state-of-the-art OCR systems with cognitive language modeling, the platform automates data entry and integrates seamlessly with enterprise ERP platforms.

---

## ✨ Features

- **🌐 Cross-Document Intelligence**: Purpose-built parsers and validation templates for:
  - **Invoices**: Extracts line items, tax details, billing terms, date chronology, and vendor records.
  - **Receipts**: Tailored for business travel, retail, and expense management logs.
  - **Purchase Orders**: Maps ordering hierarchies, delivery deadlines, unit totals, and custom terms.
- **📁 Multi-Format Upload Hub**: Supports native drag-and-drop or manual selection for PDFs, PNGs, JPGs, JPEGs, and WEBP formats up to 10MB.
- **⚡ Hybrid Visual OCR & Parsing Pipeline**:
  - Automatically identifies whether documents contain selectable digital text layers or require localized visual OCR.
  - Returns complete confidence score arrays for crucial metadata boundaries.
- **📐 Interactive Structured Workbench**:
  - **Real-Time Overlay Canvas**: Highlights OCR bounding zones interactively as you hover over structured form inputs.
  - **Interactive Spreadsheet Editor**: Edit, append, or delete line-item entities with immediate recalculations.
  - **Synchronized JSON Terminal**: Copy, inspect, and export clean JSON schemas instantly.
- **🛡️ Clinical Validation Engine**:
  - **Date Validation**: Ensures logical flow (e.g., Issue Date $\le$ Due Date).
  - **Arithmetic Integrity Check**: Performs math assertion loops ($Subtotal + Tax = Total$) and cross-references table records.
  - **Currency Uniformity**: Validates currency types across all itemization blocks.
  - **Duplicate Prevention**: Intelligently flags duplicate line entries.

---

## 🛠️ Tech Stack & Languages

- **Frontend Environment**:
  - ⚛️ **React 18** (Functional hooks architecture)
  - ⚡ **Vite** (Next-generation lightning-fast frontend tooling)
  - 🎨 **Tailwind CSS** (Utility-first styling with customized fluid design tokens)
  - 🌀 **motion/react** (Fluid micro-interactions and route-change layouts)
  - 🛠️ **Lucide React** (Consistent, modern vector iconography)
- **Backend Environment**:
  - 🟢 **Node.js** & **Express**
  - 🦾 **TypeScript** (Strict type definitions spanning client & server layers)
- **Cognitive Engines**:
  - 🧠 **Google Gen AI** (Contextual semantic analysis and structured JSON parsing)
  - 👁️ **Tesseract.js / pdf.js** (Digital text extraction and visual OCR)

---

## 📂 File Structure

```text
docextract-ai/
├── .env.example              # Environment variables template
├── .gitignore                # Production untracked files setup
├── index.html                # Entry points for Vite SPA mounting
├── package.json              # Scripts, modules, and dependencies manifests
├── server.ts                 # Full-stack server (Express, API routers, Vite middleware)
├── tsconfig.json             # TypeScript compiler rules
├── vite.config.ts            # Client-side bundler configuration
│
└── src/                      # Client application codebase
    ├── App.tsx               # Primary screen router, states, and app entry
    ├── index.css             # Tailwinds setup, base styles, and animations
    ├── main.tsx              # React mounting file
    ├── types.ts              # Global TypeScript models and structures
    │
    └── components/           # Modular visual views and cards
        ├── HomeView.tsx      # High-fidelity dashboard, landing and features page
        ├── UploadView.tsx    # File drag-and-drop and templates selector
        ├── AnalyzingView.tsx # Real-time progress visualizer and pipeline status logs
        ├── ResultsView.tsx   # Visual workbench, mock-document, and spreadsheet
        └── AnalyticsView.tsx # Dynamic arithmetic audits, confidence score gauges, and alerts
```

---

## 🚀 Installation & Local Setup

### 📋 Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (Node package manager)

### ⚙️ Step-by-Step Installation

1. **Clone the Project**:
   ```bash
   git clone <repository-url>
   cd docextract-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory by copying the example template:
   ```bash
   cp .env.example .env
   ```
   Open the newly created `.env` file and input your secure API Credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```
   The local server will boot. Open your browser and navigate to:
   👉 **`http://localhost:3000`**

5. **Build for Production**:
   Compiles client-side bundles and compiles server TypeScript into a highly optimized, standalone CommonJS module inside `dist/`:
   ```bash
   npm run build
   ```

6. **Start Production Service**:
   ```bash
   npm run start
   ```

---

## 🔒 Security & Data Compliance

- **No Public API Exposure**: All requests involving cognitive translation or secure keys are proxied safely through Node/Express backend layers. No secrets are ever transmitted to or accessible from browser developer tools.
- **Ephemeral Processing**: Document bytes are parsed dynamically and are not stored permanently.
