# 📄 DocExtract AI — Intelligent Document Data Extraction Agent

<div align="center">
  <a href="https://doc-extract-ai.netlify.app/" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/🌐_LIVE_DEMO-doc--extract--ai.netlify.app-004ac6?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
  </a>
</div>

DocExtract AI is an enterprise-grade web application and intelligent data extraction engine designed to convert unstructured physical documents—such as invoices, receipts, and purchase orders—into highly validated, structured JSON payloads. By combining state-of-the-art OCR systems with cognitive language modeling, the platform automates data entry and integrates seamlessly with enterprise ERP platforms.

---

## ✨ Features

- **🌐 Cross-Document Intelligence**: Purpose-built parsers and validation templates for:
  - **Invoices**: Extracts line items, tax details, billing terms, date chronology, and vendor records.
  - **Receipts**: Tailored for business travel, retail, and expense management logs.
  - **Purchase Orders**: Maps ordering hierarchies, delivery deadlines, unit totals, and custom terms.
- **🔄 Intelligent Multi-Provider AI Fallback Engine**:
  - Automatically routes document payloads through a resilient cognitive tier.
  - **Primary**: Google Gemini (`gemini`)
  - **Secondary / Fallback**: OpenRouter (`openrouter`) (Default: `google/gemini-2.5-flash`)
  - **Emergency Fallback**: Groq Engine (`groq`) (Default: `llama-3.2-11b-vision-preview`)
  - Logs execution traces, failover logs, error statuses, and exact API latencies directly into an interactive Diagnostics Terminal.
- **💾 Export & Portability Suite**:
  - **Download JSON**: Instantly export the fully parsed schema in clean formatted JSON for ERP ingestion.
  - **Export CSV**: Standardize metadata headers and detailed table rows into a structured CSV file for accounting and ledger management.
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
- **🌓 Adaptive Global Theme Engine**:
  - **Context-Powered Toggle**: Global theme state manager powered by a lightweight **React Context Provider** (`ThemeContext`).
  - **Dynamic Theme Synchronization**: Seamlessly toggles the root interface between high-contrast light and dark UI states.
  - **Smart Persistence**: Detects and defaults automatically to the user's OS system preferences, with manual selections securely persisted inside `localStorage`.
  - **Fluid Tokens**: Utilizes custom Tailwind design tokens to guarantee gorgeous color consistency across all views and interactive widgets under both modes.
- **🔔 Interactive Toast Notification System**:
  - **Action Acknowledgements**: Displays beautiful, non-blocking floating notifications when downloading JSON configurations, exporting CSV ledgers, copying payloads, or updating ledger items.
  - **Custom Animation Curves**: Utilizes smooth micro-motion and responsive cubic-bezier scales/slides to slide toast bubbles gracefully on screen.
  - **Multi-Type States**: Supports adaptive `success`, `info`, and `error` styles designed to blend perfectly with Light and Dark aesthetics.
- **✨ Premium View Entrance Transitions**:
  - **Dynamic Entrance**: Applies an ultra-premium slide-and-scale entrance animation to active workspaces and dashboard panels during system mounting.
  - **Visual Continuity**: Smoothes out screen-routing transitions using custom physics curves (`[0.16, 1, 0.3, 1]`) to match native desktop interfaces.

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
  - 🧠 **Multi-Model Fallback System** (Gemini, OpenRouter, Groq API interfaces)
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
├── netlify.toml              # Netlify cloud configuration
│
├── server/                   # Backend services & orchestrators
│   └── services/
│       └── ai/
│           ├── ProviderInterface.ts  # Interface standard for AI Services
│           ├── GeminiService.ts     # Google Gemini API provider integration
│           ├── OpenRouterService.ts # OpenRouter proxy service integration
│           ├── GroqService.ts       # Groq high-speed vision model integration
│           ├── FallbackManager.ts   # Failover scheduling & trace-logging engine
│           ├── PromptBuilder.ts     # Standardized schema extraction instructions
│           └── ResponseValidator.ts # Dynamic validation, sanitization, & parsing
│
└── src/                      # Client React codebase
    ├── App.tsx               # Primary screen router, states, and app entry
    ├── index.css             # Tailwinds setup, base styles, and animations
    ├── main.tsx              # React mounting file
    ├── types.ts              # Global TypeScript models and structures
    │
    ├── context/              # Global state contexts
    │   ├── ThemeContext.tsx  # Dynamic Light/Dark Theme management context
    │   └── ToastContext.tsx  # Premium Toast notification service context
    │
    └── components/           # Modular visual views and cards
        ├── HomeView.tsx      # High-fidelity dashboard, landing and features page
        ├── UploadView.tsx    # File drag-and-drop and templates selector
        ├── AnalyzingView.tsx # Real-time progress visualizer and pipeline status logs
        ├── ResultsView.tsx   # Visual workbench, mock-document, fallback engine tabs, and spreadsheet
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
   git clone https://github.com/bikram73/Document_Extract_AI
   cd Document_Extract_AI
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
   
   # Optional Fallbacks
   OPENROUTER_API_KEY=your_openrouter_key
   OPENROUTER_MODEL=google/gemini-2.5-flash
   GROQ_API_KEY=your_groq_key
   GROQ_MODEL=llama-3.2-11b-vision-preview
   AI_PROVIDER_PRIORITY=gemini,openrouter,groq
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

## ⚡ Netlify Deployment Guide

This project is fully ready for zero-config deployment to **Netlify** with dynamic serverless capability.

### 📦 Automatic Configuration
The workspace contains a `netlify.toml` file that auto-configure Netlify to:
- Run the build command (`npm run build`).
- Host static web assets from the `dist/` folder.
- Route all `/api/extract` requests directly to a serverless function at `/netlify/functions/extract.ts`.
- Fall back gracefully to `index.html` for React routing.

### ⚙️ Step-by-Step Netlify Deploy

1. **Push your code** to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to your **[Netlify Dashboard](https://app.netlify.com/)** and click **"Add new site" > "Import an existing project"**.
3. Link your Git repository.
4. Netlify will auto-detect the configuration from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. **Add Environment Variables**:
   - In Netlify, go to **Site Settings > Environment variables**.
   - Click **Add a variable** and add:
     - `GEMINI_API_KEY` = *[Your Google Gemini API Key]*
     - `OPENROUTER_API_KEY` = *[Optional: Your OpenRouter API Key]*
     - `OPENROUTER_MODEL` = *[Optional: google/gemini-2.5-flash]*
     - `GROQ_API_KEY` = *[Optional: Your Groq API Key]*
     - `GROQ_MODEL` = *[Optional: llama-3.2-11b-vision-preview]*
     - `AI_PROVIDER_PRIORITY` = *[Optional: gemini,openrouter,groq]*
6. Click **Deploy site**. Netlify will build the client and package the serverless function automatically!

---

## 🔒 Security & Data Compliance

- **No Public API Exposure**: All requests involving cognitive translation or secure keys are proxied safely through Node/Express backend layers. No secrets are ever transmitted to or accessible from browser developer tools.
- **Ephemeral Processing**: Document bytes are parsed dynamically and are not stored permanently.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).


