import { useState } from "react";
import { Sparkles, FileText, ArrowLeft, Heart, Shield, Cpu, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ActiveTab, ExtractedData, ActiveFile, SAMPLE_INVOICE_DATA 
} from "./types";
import HomeView from "./components/HomeView";
import UploadView from "./components/UploadView";
import AnalyzingView from "./components/AnalyzingView";
import ResultsView from "./components/ResultsView";
import AnalyticsView from "./components/AnalyticsView";

// Presets for the interactive samples
const SAMPLE_RECEIPT: ExtractedData = {
  documentType: "Receipt",
  vendorName: "Uber Taxi London",
  vendorTaxId: "GB 987 654 321",
  invoiceNumber: "UBR-998341-UK",
  issueDate: "Nov 14, 2024",
  dueDate: "Nov 14, 2024",
  currency: "GBP (£)",
  paymentTerms: "Due on Receipt",
  financials: {
    subtotal: 35.42,
    tax: 7.08,
    total: 42.50,
  },
  lineItems: [
    {
      description: "Business Class Ride (Paddington to Shoreditch)",
      qty: 1,
      unitPrice: 35.42,
      amount: 35.42,
    }
  ],
  confidence: {
    overall: 98,
    vendor: 100,
    date: 99,
    lineItems: 95,
    currency: 100,
  },
  insights: "Standard corporate business travel receipt. The trip route matches Paddington to Shoreditch, aligning perfectly with standard regional travel allowances.",
  integrityCheck: {
    dateValidation: "PASSED",
    arithmeticTotal: "PASSED",
    currencyConsistency: "PASSED",
  },
  alerts: []
};

const SAMPLE_PO: ExtractedData = {
  documentType: "Purchase Order",
  vendorName: "Acme Hardware Corp",
  vendorTaxId: "US 112 233 445",
  invoiceNumber: "PO-883921",
  issueDate: "Dec 01, 2024",
  dueDate: "Dec 31, 2024",
  currency: "USD ($)",
  paymentTerms: "Net 30",
  financials: {
    subtotal: 8500.00,
    tax: 0.00,
    total: 8500.00,
  },
  lineItems: [
    {
      description: "ThinkStation Workstation P3 Dual GPU",
      qty: 5,
      unitPrice: 1700.00,
      amount: 8500.00,
    }
  ],
  confidence: {
    overall: 92,
    vendor: 95,
    date: 90,
    lineItems: 91,
    currency: 100,
  },
  insights: "Hardware procurement order for engineering department assets. Zero-tax configuration applied due to company's corporate tax-exempt ID on file.",
  integrityCheck: {
    dateValidation: "PASSED",
    arithmeticTotal: "PASSED",
    currencyConsistency: "PASSED",
  },
  alerts: [
    {
      title: "Quantity Variance",
      message: "The requested quantity of workstations (5) exceeds the standard department threshold. Verify authorization."
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [activeFile, setActiveFile] = useState<ActiveFile>({
    name: "Stripe Invoice.pdf",
    size: "1.2 MB",
    base64Data: "",
    mimeType: "application/pdf"
  });
  
  const [extractedData, setExtractedData] = useState<ExtractedData>(SAMPLE_INVOICE_DATA);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fallback Engine state
  const [providerUsed, setProviderUsed] = useState<string>("gemini");
  const [providerReason, setProviderReason] = useState<string>("Primary Provider");
  const [providerLogs, setProviderLogs] = useState<any[]>([
    {
      provider: "gemini",
      event: "STARTED",
      message: "Attempting document extraction using GEMINI (Primary)...",
      timestamp: new Date(Date.now() - 4000).toISOString(),
    },
    {
      provider: "gemini",
      event: "SUCCESS",
      message: "Successfully extracted structured data in 452ms.",
      timestamp: new Date().toISOString(),
      latencyMs: 452,
    },
  ]);

  // Nav actions
  const handleStartExtract = () => {
    setActiveTab("upload");
  };

  const handleViewSample = () => {
    setActiveFile({
      name: "Stripe Invoice.pdf",
      size: "1.24 MB",
      base64Data: "",
      mimeType: "application/pdf"
    });
    setExtractedData(SAMPLE_INVOICE_DATA);
    setProviderUsed("gemini");
    setProviderReason("Primary Provider");
    setProviderLogs([
      {
        provider: "gemini",
        event: "STARTED",
        message: "Attempting document extraction using GEMINI (Primary)...",
        timestamp: new Date(Date.now() - 4000).toISOString(),
      },
      {
        provider: "gemini",
        event: "SUCCESS",
        message: "Successfully extracted structured data in 452ms.",
        timestamp: new Date().toISOString(),
        latencyMs: 452,
      },
    ]);
    setErrorMsg(null);
    setActiveTab("results");
  };

  // Sample presets trigger
  const handleSelectSample = (sampleType: "invoice" | "receipt" | "po") => {
    setErrorMsg(null);
    if (sampleType === "invoice") {
      setActiveFile({
        name: "Stripe Invoice.pdf",
        size: "1.24 MB",
        base64Data: "",
        mimeType: "application/pdf"
      });
      setExtractedData(SAMPLE_INVOICE_DATA);
      setProviderUsed("gemini");
      setProviderReason("Primary Provider");
      setProviderLogs([
        {
          provider: "gemini",
          event: "STARTED",
          message: "Attempting document extraction using GEMINI (Primary)...",
          timestamp: new Date(Date.now() - 4000).toISOString(),
        },
        {
          provider: "gemini",
          event: "SUCCESS",
          message: "Successfully extracted structured data in 452ms.",
          timestamp: new Date().toISOString(),
          latencyMs: 452,
        },
      ]);
    } else if (sampleType === "receipt") {
      setActiveFile({
        name: "Uber Taxi Receipt.png",
        size: "420 KB",
        base64Data: "",
        mimeType: "image/png"
      });
      setExtractedData(SAMPLE_RECEIPT);
      setProviderUsed("openrouter");
      setProviderReason("Primary provider rate-limited (429); automatically failed over to OpenRouter");
      setProviderLogs([
        {
          provider: "gemini",
          event: "STARTED",
          message: "Attempting document extraction using GEMINI (Primary)...",
          timestamp: new Date(Date.now() - 6000).toISOString(),
        },
        {
          provider: "gemini",
          event: "FAILED",
          message: "API request failed with status 429: Too Many Requests. Rate limit exceeded.",
          timestamp: new Date(Date.now() - 4500).toISOString(),
          latencyMs: 1500,
        },
        {
          provider: "openrouter",
          event: "STARTED",
          message: "Initiating primary fallback via OpenRouter (google/gemini-2.5-flash)...",
          timestamp: new Date(Date.now() - 4500).toISOString(),
        },
        {
          provider: "openrouter",
          event: "SUCCESS",
          message: "Successfully extracted structured data using OpenRouter in 980ms.",
          timestamp: new Date().toISOString(),
          latencyMs: 980,
        },
      ]);
    } else {
      setActiveFile({
        name: "Acme Corp Purchase.jpg",
        size: "950 KB",
        base64Data: "",
        mimeType: "image/jpeg"
      });
      setExtractedData(SAMPLE_PO);
      setProviderUsed("groq");
      setProviderReason("Primary provider rate-limited (429) and secondary OpenRouter timed out; emergency failover to Groq");
      setProviderLogs([
        {
          provider: "gemini",
          event: "STARTED",
          message: "Attempting document extraction using GEMINI (Primary)...",
          timestamp: new Date(Date.now() - 10000).toISOString(),
        },
        {
          provider: "gemini",
          event: "FAILED",
          message: "API request failed with status 429: Too Many Requests.",
          timestamp: new Date(Date.now() - 8500).toISOString(),
          latencyMs: 1500,
        },
        {
          provider: "openrouter",
          event: "STARTED",
          message: "Initiating fallback extraction using OpenRouter...",
          timestamp: new Date(Date.now() - 8500).toISOString(),
        },
        {
          provider: "openrouter",
          event: "FAILED",
          message: "API request failed with status 503: Service Temporarily Unavailable.",
          timestamp: new Date(Date.now() - 4000).toISOString(),
          latencyMs: 4500,
        },
        {
          provider: "groq",
          event: "STARTED",
          message: "Initiating emergency fallback using Groq (llama-3.2-11b-vision-preview)...",
          timestamp: new Date(Date.now() - 4000).toISOString(),
        },
        {
          provider: "groq",
          event: "SUCCESS",
          message: "Successfully extracted structured data using Groq in 610ms.",
          timestamp: new Date().toISOString(),
          latencyMs: 610,
        },
      ]);
    }
    setActiveTab("analyzing");
  };

  // Custom User File selected -> process via actual server-side API endpoint
  const handleFileSelected = async (file: ActiveFile) => {
    setActiveFile(file);
    setErrorMsg(null);
    setActiveTab("analyzing");

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64Data: file.base64Data,
          mimeType: file.mimeType,
          fileName: file.name
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setExtractedData(resData.data);
        setProviderUsed(resData.providerUsed || "gemini");
        setProviderReason(resData.providerReason || "Primary Provider");
        setProviderLogs(resData.providerLogs || []);
      } else {
        setErrorMsg(resData.error || "An error occurred during extraction.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not connect to the extraction service.");
    }
  };

  const handleAnalysisComplete = () => {
    if (!errorMsg) {
      setActiveTab("results");
    }
  };

  const handleUpdateData = (updated: ExtractedData) => {
    setExtractedData(updated);
  };

  const handleGoToAnalytics = () => {
    setActiveTab("analytics");
  };

  const handleGoBackToResults = () => {
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      
      {/* Premium Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-outline-variant/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-on-surface">DocExtract <span className="text-primary">AI</span></span>
              <span className="text-[10px] block text-primary font-bold tracking-wider font-sans leading-none uppercase mt-0.5">AI Extraction Engine</span>
            </div>
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab("home")}
              className={`text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "home" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Home
            </button>
            <button 
              onClick={handleStartExtract}
              className={`text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "upload" || activeTab === "analyzing" || activeTab === "results" || activeTab === "analytics"
                  ? "text-primary" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Workspace
            </button>
            <a 
              href="#features"
              onClick={() => activeTab !== "home" && setActiveTab("home")}
              className="text-sm font-semibold text-on-surface-variant hover:text-on-surface hidden md:block"
            >
              Features
            </a>
          </nav>
        </div>
      </header>

      {/* Main Screen Router with AnimatePresence layout animations */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "home" && (
              <HomeView 
                onStartExtract={handleStartExtract} 
                onViewSample={handleViewSample} 
              />
            )}

            {activeTab === "upload" && (
              <UploadView 
                onFileSelected={handleFileSelected} 
                onSelectSample={handleSelectSample} 
              />
            )}

            {activeTab === "analyzing" && (
              <AnalyzingView 
                fileName={activeFile.name} 
                fileSize={activeFile.size} 
                errorMsg={errorMsg}
                onAnalysisComplete={handleAnalysisComplete} 
              />
            )}

            {activeTab === "results" && (
              <ResultsView 
                data={extractedData} 
                fileName={activeFile.name} 
                fileSize={activeFile.size} 
                onUpdateData={handleUpdateData}
                onGoToAnalytics={handleGoToAnalytics}
                providerUsed={providerUsed}
                providerReason={providerReason}
                providerLogs={providerLogs}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsView 
                data={extractedData} 
                onGoBack={handleGoBackToResults}
                onUpdateData={handleUpdateData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Humble, Professional Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© 2026 DocExtract AI. Cloud Document Intelligence Platform.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Powered by</span>
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-slate-800">AI Document Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
