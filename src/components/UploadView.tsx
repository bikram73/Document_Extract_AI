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
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
          Upload Document for Analysis
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          Choose a standard business document like an invoice, receipt, or purchase order. Our AI-driven fallback pipeline will parse keys, lines, and metrics instantly.
        </p>

        {/* Quick badges */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-1 sm:pt-2">
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-medium border border-blue-100/50 dark:border-blue-900/30">
            <Zap className="w-3 h-3" /> Auto Failover Pipeline
          </span>
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs font-medium border border-emerald-100/50 dark:border-emerald-900/30">
            <ShieldCheck className="w-3 h-3" /> Secure Client Privacy
          </span>
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 text-[10px] sm:text-xs font-medium border border-indigo-100/50 dark:border-indigo-900/30">
            <Layers className="w-3 h-3" /> Hierarchical Extractor
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs sm:text-sm rounded-2xl flex items-center gap-2">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Centered Workspace wrapper with absolute precision for responsive rendering */}
      <div className="w-full max-w-2xl mx-auto space-y-8 sm:space-y-12">
        
        {/* Upload Block wrapper (div:nth-of-type(1) of centered container) */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative rounded-3xl border-2 border-dashed p-6 sm:p-10 md:p-12 text-center transition-all cursor-pointer group ${
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

          {/* Selector 2: Upload Icon container */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-blue-50/80 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:shadow-lg group-hover:shadow-blue-500/15 mb-4 sm:mb-5 border border-blue-100 dark:border-blue-900/30">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          </div>

          {/* Selector 3: Upload Text Info container */}
          <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            <p className="font-extrabold text-on-surface text-sm sm:text-base md:text-lg lg:text-xl tracking-tight">
              Drag &amp; drop document files
            </p>
            <p className="text-xs sm:text-sm md:text-base text-on-surface-variant">
              or <span className="text-primary font-bold underline decoration-2 decoration-primary/30 group-hover:decoration-primary transition-all duration-300">browse files</span> from your device
            </p>
          </div>

          {/* Selector 4: File size limitations container */}
          <div className="text-[11px] sm:text-xs md:text-sm font-semibold text-on-surface-variant/90 bg-surface-container-low dark:bg-slate-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full inline-flex items-center gap-2 border border-outline-variant/20 shadow-sm">
            PDF, PNG, JPG, or WEBP up to 10MB
          </div>
        </div>

        {/* Sample presets block (div:nth-of-type(2) of centered container) */}
        <div className="space-y-5 text-left">
          
          {/* Selector 5: Preset Titles & badges flex block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-outline-variant/30">
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-on-surface flex items-center gap-2.5 tracking-tight">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500/20" /> Try a Pre-loaded Document
            </h2>
            <span className="text-[10px] sm:text-xs md:text-sm text-on-surface-variant font-semibold bg-surface-container-low dark:bg-slate-900/40 px-3 py-1.5 rounded-full border border-outline-variant/20 shadow-sm self-start sm:self-auto flex items-center gap-1.5">No upload required • Dynamic fallbacks</span>
          </div>

          {/* Selector 6: Presets buttons grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <button
              onClick={() => onSelectSample("invoice")}
              className="flex items-start gap-3.5 sm:gap-4 p-4.5 sm:p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:shadow-lg transition-all text-left w-full cursor-pointer group hover:-translate-y-0.5 duration-300"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 sm:space-y-1 w-full min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] sm:text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">Invoice</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <p className="font-bold text-xs sm:text-sm md:text-base text-on-surface truncate">Stripe Invoice.pdf</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-on-surface-variant truncate">Default UK billing template</p>
              </div>
            </button>

            <button
              onClick={() => onSelectSample("receipt")}
              className="flex items-start gap-3.5 sm:gap-4 p-4.5 sm:p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:shadow-lg transition-all text-left w-full cursor-pointer group hover:-translate-y-0.5 duration-300"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <ImageIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 sm:space-y-1 w-full min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] sm:text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50/70 dark:bg-purple-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">Receipt</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <p className="font-bold text-xs sm:text-sm md:text-base text-on-surface truncate">Uber Taxi Receipt.png</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-on-surface-variant truncate">Standard business transport</p>
              </div>
            </button>

            <button
              onClick={() => onSelectSample("po")}
              className="flex items-start gap-3.5 sm:gap-4 p-4.5 sm:p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:shadow-lg transition-all text-left w-full cursor-pointer group hover:-translate-y-0.5 duration-300"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 sm:space-y-1 w-full min-w-0">
                <div className="flex items-center justify-between gap-1 min-w-0">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50/70 dark:bg-cyan-950/40 px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider truncate min-w-0" title="Purchase Order">Purchase Order</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <p className="font-bold text-xs sm:text-sm md:text-base text-on-surface truncate">Acme Corp Purchase.jpg</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-on-surface-variant truncate">B2B hardware equipment</p>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Multi-Provider Failover Map / Workflow Block */}
      <div className="bg-gradient-to-tr from-slate-50 to-blue-50/20 dark:from-slate-900/40 dark:to-blue-950/10 border border-outline-variant/30 rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" /> Auto-Fallback Extraction Process
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            If our primary AI model fails or hits token limits, the engine will seamlessly failover to preserve your workflow:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
          <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-slate-400 font-mono">01</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full shrink-0">Primary</span>
              </div>
              <h4 className="font-semibold text-xs text-on-surface mt-1">Google Gemini</h4>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Primary multi-modal parser. Extracts complex multi-table structures instantly.</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-slate-400 font-mono">02</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full shrink-0">Secondary</span>
              </div>
              <h4 className="font-semibold text-xs text-on-surface mt-1">OpenRouter (Gemini)</h4>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Sub-second alternative path. Takes over instantly in case of quota constraints.</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-slate-400 font-mono">03</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full shrink-0">Tertiary</span>
              </div>
              <h4 className="font-semibold text-xs text-on-surface mt-1">Groq (Llama Vision)</h4>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Ultra-low latency fallback route optimized for extremely high-speed extractions.</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-slate-400 font-mono">04</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-full shrink-0">Integrity</span>
              </div>
              <h4 className="font-semibold text-xs text-on-surface mt-1">Mathematical Audit</h4>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Performs tax, quantity, and line-item arithmetic validation automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
