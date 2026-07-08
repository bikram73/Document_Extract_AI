import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Sparkles, CheckCircle2, ChevronRight, Image as ImageIcon } from "lucide-react";
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
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
          Upload Document for Analysis
        </h1>
        <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
          Choose a standard business document like an invoice, receipt, or purchase order. Our AI parser will extract line items, financials, and metadata automatically.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Drag & Drop Card */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative rounded-3xl border-2 border-dashed p-12 text-center transition-all cursor-pointer group ${
          dragActive 
            ? "border-primary bg-blue-50/40" 
            : "border-outline-variant hover:border-primary/60 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,image/png,image/jpeg,image/webp"
          onChange={handleChange}
        />

        <div className="max-w-sm mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="font-bold text-on-surface text-base">
              Drag and drop document files here
            </p>
            <p className="text-xs text-on-surface-variant">
              or <span className="text-primary font-semibold underline">browse files</span> from your device
            </p>
          </div>

          <p className="text-xs text-on-surface-variant/70">
            Supports PDF, PNG, JPG, and WEBP up to 10MB
          </p>
        </div>
      </div>

      {/* Sample presets */}
      <div className="mt-12 space-y-4 text-left">
        <h2 className="text-lg font-bold text-on-surface">Or explore a pre-populated template:</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => onSelectSample("invoice")}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary hover:shadow-md transition-all text-left w-full cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Invoice</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="font-semibold text-sm text-on-surface">Stripe Invoice.pdf</p>
              <p className="text-xs text-on-surface-variant">Default UK billing template</p>
            </div>
          </button>

          <button
            onClick={() => onSelectSample("receipt")}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary hover:shadow-md transition-all text-left w-full cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full uppercase">Receipt</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="font-semibold text-sm text-on-surface">Uber Taxi Receipt.png</p>
              <p className="text-xs text-on-surface-variant">Standard business transport</p>
            </div>
          </button>

          <button
            onClick={() => onSelectSample("po")}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary hover:shadow-md transition-all text-left w-full cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full uppercase">Purchase Order</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="font-semibold text-sm text-on-surface">Acme Corp Purchase.jpg</p>
              <p className="text-xs text-on-surface-variant">B2B hardware equipment</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
