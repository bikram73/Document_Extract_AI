import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, ShieldAlert, FileText, Cpu, Calculator, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface AnalyzingViewProps {
  fileName: string;
  fileSize: string;
  onAnalysisComplete: () => void;
  errorMsg?: string | null;
}

export default function AnalyzingView({ fileName, fileSize, onAnalysisComplete, errorMsg }: AnalyzingViewProps) {
  const [progress, setProgress] = useState(74);
  const [currentStep, setCurrentStep] = useState(2); // 0: OCR, 1: Parser, 2: LLM, 3: Validation, 4: Done

  useEffect(() => {
    if (errorMsg) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Allow a brief delay at 100% before transition
          setTimeout(() => {
            onAnalysisComplete();
          }, 800);
          return 100;
        }
        
        const nextVal = prev + Math.floor(Math.random() * 4) + 1;
        
        // Update current step based on percentage thresholds
        if (nextVal < 82) {
          setCurrentStep(2); // LLM categorization
        } else if (nextVal < 94) {
          setCurrentStep(3); // Arithmetic & Validation
        } else {
          setCurrentStep(4); // All done
        }

        return Math.min(nextVal, 100);
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onAnalysisComplete, errorMsg]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="space-y-8">
        {/* Animated Scanning Document */}
        <div className="relative w-48 h-64 bg-white border border-slate-200 rounded-2xl mx-auto shadow-xl overflow-hidden document-canvas flex flex-col justify-between p-4">
          {/* Scanning animated red-blue laser line */}
          <div className="scanning-line"></div>
          
          <div className="flex items-center justify-between">
            <FileText className="w-8 h-8 text-blue-600/60" />
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center animate-pulse">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            </div>
          </div>
          
          <div className="space-y-2 text-left">
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            <div className="h-3 bg-slate-100 rounded w-4/5"></div>
          </div>

          <div className="flex justify-between items-center text-slate-400 text-[9px] font-mono">
            <span>OCR ACTIVE</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Big percentage counter */}
        <div className="space-y-2">
          {errorMsg ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-100 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Extraction Suspended</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-xs font-semibold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Running AI Extraction Pipeline</span>
            </div>
          )}

          <h2 className="text-6xl font-black text-on-surface font-mono tracking-tighter">
            {errorMsg ? "Error" : `${progress}%`}
          </h2>
          <p className="text-sm font-semibold text-on-surface">
            {errorMsg ? "Something went wrong" : `Analyzing "${fileName}" (${fileSize})`}
          </p>
        </div>

        {errorMsg ? (
          <div className="bg-red-50 text-red-800 border border-red-200 rounded-2xl p-6 text-left max-w-md mx-auto space-y-3 shadow-sm">
            <p className="font-bold text-sm">Failed to extract structured data:</p>
            <p className="text-xs font-mono break-all leading-relaxed bg-white p-3 rounded-xl border border-red-100">{errorMsg}</p>
            <p className="text-xs text-red-600">Please check that your GEMINI_API_KEY is configured in your project Secrets panel.</p>
          </div>
        ) : (
          /* Process steps list */
          <div className="max-w-md mx-auto bg-white border border-outline-variant/30 rounded-2xl p-6 text-left shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Analysis Logs</h3>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50 shrink-0" />
                  <span className="text-sm text-on-surface font-semibold">OCR Layer Recognition</span>
                </div>
                <span className="text-xs text-green-600 font-bold font-mono">100% Ready</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50 shrink-0" />
                  <span className="text-sm text-on-surface font-semibold">Structure Mapping &amp; Alignment</span>
                </div>
                <span className="text-xs text-green-600 font-bold font-mono">100% Ready</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentStep > 2 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50 shrink-0" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                  )}
                  <span className={`text-sm font-semibold ${currentStep > 2 ? "text-on-surface" : "text-blue-600 animate-pulse"}`}>
                    LLM Field Categorization
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-on-surface-variant">
                  {currentStep > 2 ? "Done" : "In Progress"}
                </span>
              </div>

              {/* Step 4 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentStep === 4 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50 shrink-0" />
                  ) : currentStep === 3 ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0"></div>
                  )}
                  <span className={`text-sm font-semibold ${
                    currentStep === 4 
                      ? "text-on-surface" 
                      : currentStep === 3 
                        ? "text-blue-600 animate-pulse" 
                        : "text-on-surface-variant"
                  }`}>
                    Arithmetic Integrity Check
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-on-surface-variant">
                  {currentStep === 4 ? "Done" : currentStep === 3 ? "Verifying..." : "Queued"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
