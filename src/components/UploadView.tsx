import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Sparkles, CheckCircle2, ChevronRight, Image as ImageIcon, ShieldCheck, Zap, Layers, HelpCircle, Check } from "lucide-react";
import { motion } from "motion/react";
import { ActiveFile } from "../types";

interface UploadViewProps {
  onFileSelected: (file: ActiveFile) => void;
  onSelectSample: (sampleType: "invoice" | "receipt" | "po") => void;
}

export default function UploadView({ onFileSelected, onSelectSample }: UploadViewProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds the maximum size limit of 10MB");
      return;
    }

    // Validate type
    const validMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic"
    ];
    if (!validMimeTypes.includes(file.type)) {
      setError("Supported file formats are PDF, PNG, JPG, and WEBP.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract the raw base64 data without the dataurl header (e.g. data:image/png;base64,...)
      const commaIndex = result.indexOf(",");
      if (commaIndex !== -1) {
        const base64Data = result.substring(commaIndex + 1);
        onFileSelected({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          base64Data: base64Data,
          mimeType: file.type,
          isCustom: true
        });
      }
    };
    reader.onerror = () => {
      setError("Could not read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
          Upload Document for Analysis
        </h1>
        <p className="text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          Choose a standard business document like an invoice, receipt, or purchase order. Our AI-driven fallback pipeline will parse keys, lines, and metrics instantly.
        </p>

        {/* Quick badges */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-100/50 dark:border-blue-900/30">
            <Zap className="w-3 h-3" /> Auto Failover Pipeline
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-100/50 dark:border-emerald-900/30">
            <ShieldCheck className="w-3 h-3" /> Secure Client Privacy
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 text-xs font-medium border border-indigo-100/50 dark:border-indigo-900/30">
            <Layers className="w-3 h-3" /> Hierarchical Extractor
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-sm rounded-2xl flex items-center gap-2">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Centered Upload Block */}
      <div className="w-full max-w-2xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative rounded-3xl border-2 border-dashed p-12 text-center transition-all cursor-pointer group ${
            dragActive 
              ? "border-primary bg-blue-50/10 dark:bg-blue-950/20" 
              : "border-outline-variant hover:border-primary/60 bg-surface-container-lowest"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,image/png,image/jpeg,image/webp"
            onChange={handleChange}
          />

          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="font-bold text-on-surface text-base">
                Drag &amp; drop document files
              </p>
              <p className="text-xs text-on-surface-variant">
                or <span className="text-primary font-semibold underline">browse files</span> from your device
              </p>
            </div>

            <p className="text-xs text-on-surface-variant/70 bg-surface-container-low dark:bg-slate-900 px-3 py-1.5 rounded-full inline-block">
              PDF, PNG, JPG, or WEBP up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Sample presets */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500/20" /> Try a Pre-loaded Document
          </h2>
          <span className="text-xs text-on-surface-variant font-medium">No upload required • Dynamic fallbacks</span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => onSelectSample("invoice")}
            className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:shadow-md transition-all text-left w-full cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase">Invoice</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="font-semibold text-sm text-on-surface">Stripe Invoice.pdf</p>
              <p className="text-xs text-on-surface-variant">Default UK billing template</p>
            </div>
          </button>

          <button
            onClick={() => onSelectSample("receipt")}
            className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:shadow-md transition-all text-left w-full cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full uppercase">Receipt</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="font-semibold text-sm text-on-surface">Uber Taxi Receipt.png</p>
              <p className="text-xs text-on-surface-variant">Standard business transport</p>
            </div>
          </button>

          <button
            onClick={() => onSelectSample("po")}
            className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:shadow-md transition-all text-left w-full cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-full uppercase">Purchase Order</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="font-semibold text-sm text-on-surface">Acme Corp Purchase.jpg</p>
              <p className="text-xs text-on-surface-variant">B2B hardware equipment</p>
            </div>
          </button>
        </div>
      </div>

      {/* Multi-Provider Failover Map / Workflow Block */}
      <div className="bg-gradient-to-tr from-slate-50 to-blue-50/20 dark:from-slate-900/40 dark:to-blue-950/10 border border-outline-variant/30 rounded-3xl p-6 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" /> Auto-Fallback Extraction Process
          </h3>
          <p className="text-xs text-on-surface-variant">
            If our primary AI model fails or hits token limits, the engine will seamlessly failover to preserve your workflow:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full">Primary</div>
            <span className="text-xs font-black text-slate-400 font-mono">01</span>
            <h4 className="font-semibold text-xs text-on-surface mt-1">Google Gemini</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Primary multi-modal parser. Extracts complex multi-table structures instantly.</p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">Secondary</div>
            <span className="text-xs font-black text-slate-400 font-mono">02</span>
            <h4 className="font-semibold text-xs text-on-surface mt-1">OpenRouter (Gemini)</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Sub-second alternative path. Takes over instantly in case of quota constraints.</p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full">Tertiary</div>
            <span className="text-xs font-black text-slate-400 font-mono">03</span>
            <h4 className="font-semibold text-xs text-on-surface mt-1">Groq (Llama Vision)</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Ultra-low latency fallback route optimized for extremely high-speed extractions.</p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Integrity</div>
            <span className="text-xs font-black text-slate-400 font-mono">04</span>
            <h4 className="font-semibold text-xs text-on-surface mt-1">Mathematical Audit</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Performs tax, quantity, and line-item arithmetic validation automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
