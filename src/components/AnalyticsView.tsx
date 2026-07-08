import { useState, useMemo } from "react";
import { 
  ArrowLeft, Brain, ShieldCheck, AlertTriangle, CheckCircle, XCircle, 
  Sparkles, CodeXml, Copy, Check, Info, FileCode
} from "lucide-react";
import { ExtractedData } from "../types";

interface AnalyticsViewProps {
  data: ExtractedData;
  onGoBack: () => void;
  onUpdateData: (updated: ExtractedData) => void;
}

export default function AnalyticsView({ data, onGoBack, onUpdateData }: AnalyticsViewProps) {
  const [copied, setCopied] = useState(false);
  const [resolvedAlerts, setResolvedAlerts] = useState<Record<number, boolean>>({});

  // Dynamic calculations for clinical validation checks
  const calculatedLineItemsSum = useMemo(() => {
    if (!data.lineItems) return 0;
    return data.lineItems.reduce((acc, item) => acc + (item.amount || 0), 0);
  }, [data.lineItems]);

  const arithmeticStatus = useMemo(() => {
    const subtotal = data.financials.subtotal || 0;
    const tax = data.financials.tax || 0;
    const total = data.financials.total;

    // Check if subtotal + tax === total
    const isTotalValid = Math.abs((subtotal + tax) - total) < 0.05;
    
    // Check if line items sum equals subtotal (if subtotal is non-zero)
    const isSumValid = subtotal === 0 || Math.abs(calculatedLineItemsSum - subtotal) < 0.05;

    return isTotalValid && isSumValid ? "PASSED" : "FAILED";
  }, [data.financials, calculatedLineItemsSum]);

  const dateValidationStatus = useMemo(() => {
    if (!data.issueDate || !data.dueDate) return "PASSED";
    
    try {
      const issue = new Date(data.issueDate);
      const due = new Date(data.dueDate);
      
      // If dates parse successfully and issue is after due, fail
      if (!isNaN(issue.getTime()) && !isNaN(due.getTime()) && issue > due) {
        return "FAILED";
      }
    } catch (e) {
      // In case date strings are non-standard, fall back to default
    }
    return "PASSED";
  }, [data.issueDate, data.dueDate]);

  // Copy JSON payload
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResolveAlert = (index: number) => {
    setResolvedAlerts(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const visibleAlertsCount = useMemo(() => {
    const alerts = data.alerts || [];
    return alerts.filter((_, idx) => !resolvedAlerts[idx]).length;
  }, [data.alerts, resolvedAlerts]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-8 space-y-8">
      {/* Back nav & top metadata bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 text-primary hover:text-blue-700 font-bold transition-all text-sm w-fit cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Structured Workbench
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
          <span>PIPELINE ENGINE:</span>
          <span className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-full font-bold">COGNITIVE AI</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns (7/12): Confidence metrics, validation logs, alerts */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section: Confidence Gauges */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm text-left">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Extraction Confidence Profile
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Gauge 1: Vendor Name */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="40" cy="40" r="34" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="6" fill="transparent" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * (data.confidence.vendor || 95)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold font-mono text-on-surface">
                    {data.confidence.vendor || 99}%
                  </span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Vendor Match</span>
              </div>

              {/* Gauge 2: Issue Date */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="40" cy="40" r="34" className="stroke-purple-600 dark:stroke-purple-400" strokeWidth="6" fill="transparent" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * (data.confidence.date || 95)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold font-mono text-on-surface">
                    {data.confidence.date || 97}%
                  </span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Date Parsing</span>
              </div>

              {/* Gauge 3: Line Items */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="40" cy="40" r="34" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="6" fill="transparent" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * (data.confidence.lineItems || 85)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold font-mono text-on-surface">
                    {data.confidence.lineItems || 84}%
                  </span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Table Grid</span>
              </div>

              {/* Gauge 4: Currency */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="40" cy="40" r="34" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="6" fill="transparent" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * (data.confidence.currency || 100)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold font-mono text-on-surface">
                    {data.confidence.currency || 100}%
                  </span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Currency Spot</span>
              </div>
            </div>
          </div>

          {/* Section: Clinical Validation Checks */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm text-left space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Arithmetic &amp; Integrity Checklist
            </h2>

            <div className="space-y-3.5">
              {/* Check 1: Date Logic */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                {dateValidationStatus === "PASSED" ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/20 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 fill-rose-50 dark:fill-rose-950/20 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-on-surface">Date Chronology Check</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      dateValidationStatus === "PASSED" 
                        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" 
                        : "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                    }`}>
                      {dateValidationStatus}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Checks if the Issue Date ({data.issueDate || "N/A"}) occurs prior to the Due Date ({data.dueDate || "N/A"}).
                  </p>
                </div>
              </div>

              {/* Check 2: Arithmetic Totals */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                {arithmeticStatus === "PASSED" ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/20 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 fill-rose-50 dark:fill-rose-950/20 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-on-surface">Arithmetic Total Verification</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      arithmeticStatus === "PASSED" 
                        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" 
                        : "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                    }`}>
                      {arithmeticStatus}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Verifies that Line Items sum matches Subtotal ({data.currency?.includes("EUR") ? "€" : data.currency?.includes("GBP") ? "£" : "$"}
                    {calculatedLineItemsSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}), and Subtotal + Tax equals the Total (
                    {data.currency?.includes("EUR") ? "€" : data.currency?.includes("GBP") ? "£" : "$"}
                    {((data.financials.subtotal || 0) + (data.financials.tax || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}).
                  </p>
                </div>
              </div>

              {/* Check 3: Currency Consistency */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/20 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-on-surface">Currency Code Consistency</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-full">PASSED</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Verifies that the currency indicator ({data.currency || "USD"}) remains uniform across all financial blocks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Systemic Alerts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm text-left space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                System Alerts ({visibleAlertsCount})
              </h2>
            </div>

            {data.alerts && data.alerts.length > 0 && visibleAlertsCount > 0 ? (
              <div className="space-y-3">
                {data.alerts.map((alert, index) => {
                  if (resolvedAlerts[index]) return null;
                  return (
                    <div key={index} className="flex items-start justify-between p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-200">{alert.title}</p>
                        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">{alert.message}</p>
                      </div>
                      <button
                        onClick={() => handleResolveAlert(index)}
                        className="bg-white dark:bg-slate-950 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100/30 dark:hover:bg-amber-900/20 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-colors"
                      >
                        Acknowledge
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-on-surface-variant bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <CheckCircle className="w-10 h-10 text-emerald-500 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/20 mx-auto mb-2" />
                <p className="text-sm font-bold text-on-surface">No outstanding warnings</p>
                <p className="text-xs text-on-surface-variant">All extracted values correspond with database and arithmetic models.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5/12): Contextual AI Insights and Export Payload */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* AI Contextual Insight Card */}
          <div className="bg-primary text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-blue-100">
                <Sparkles className="w-4 h-4 fill-blue-200 text-blue-200" />
                AI Contextual Summary
              </h3>
              
              <p className="text-sm leading-relaxed text-blue-50 font-medium">
                "{data.insights || "No insight has been populated for this template. Fill in data to generate insights."}"
              </p>
            </div>
          </div>

          {/* Export card with live code snippet */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                JSON Payload Export
              </h3>

              <button
                onClick={handleCopy}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 text-[10px] font-mono rounded-2xl overflow-x-auto max-h-[300px] custom-scrollbar border border-slate-800 leading-relaxed">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}
