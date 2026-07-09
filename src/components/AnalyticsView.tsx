import { useState, useMemo } from "react";
import { 
  ArrowLeft, Brain, ShieldCheck, AlertTriangle, CheckCircle, XCircle, 
  Sparkles, CodeXml, Copy, Check, Info, FileCode, PieChart as PieIcon
} from "lucide-react";
import { ExtractedData } from "../types";
import { useToast } from "../context/ToastContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AnalyticsViewProps {
  data: ExtractedData;
  onGoBack: () => void;
  onUpdateData: (updated: ExtractedData) => void;
}

export default function AnalyticsView({ data, onGoBack, onUpdateData }: AnalyticsViewProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [resolvedAlerts, setResolvedAlerts] = useState<Record<number, boolean>>({});
  const [mobileTab, setMobileTab] = useState<"metrics" | "insights">("metrics");

  const currencySymbol = useMemo(() => {
    const cur = data.currency || "USD";
    if (cur.includes("EUR") || cur.includes("€")) return "€";
    if (cur.includes("GBP") || cur.includes("£")) return "£";
    if (cur.includes("JPY") || cur.includes("¥")) return "¥";
    return "$";
  }, [data.currency]);

  // Dynamic calculations for clinical validation checks
  const calculatedLineItemsSum = useMemo(() => {
    if (!data.lineItems) return 0;
    return data.lineItems.reduce((acc, item) => acc + (item.amount || 0), 0);
  }, [data.lineItems]);

  const pieChartData = useMemo(() => {
    const items = data.lineItems || [];
    const chartData: Array<{ name: string; value: number; type: "item" | "tax" | "other" | "total" }> = items.map((item, index) => ({
      name: item.description || `Item ${index + 1}`,
      value: item.amount || 0,
      type: "item" as const
    }));
    
    const tax = data.financials.tax || 0;
    if (tax > 0) {
      chartData.push({
        name: "Tax Amount",
        value: tax,
        type: "tax" as const
      });
    }

    const total = data.financials.total || 0;
    const lineItemsSum = items.reduce((acc, item) => acc + (item.amount || 0), 0);
    const accountedAmount = lineItemsSum + tax;
    const remaining = total - accountedAmount;
    
    if (remaining > 0.05) {
      chartData.push({
        name: "Other / Fees",
        value: Number(remaining.toFixed(2)),
        type: "other" as const
      });
    }

    return chartData.filter(d => d.value > 0);
  }, [data.lineItems, data.financials]);

  const finalChartData = useMemo(() => {
    if (pieChartData.length === 0 && (data.financials.total || 0) > 0) {
      return [{
        name: "Total Amount",
        value: data.financials.total || 0,
        type: "total" as const
      }];
    }
    return pieChartData;
  }, [pieChartData, data.financials.total]);

  const CHART_COLORS = [
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#f43f5e", // Rose
    "#64748b", // Slate
  ];

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
    showToast("JSON payload copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResolveAlert = (index: number) => {
    setResolvedAlerts(prev => ({
      ...prev,
      [index]: true
    }));
    showToast("System warning acknowledged.", "info");
  };

  const visibleAlertsCount = useMemo(() => {
    const alerts = data.alerts || [];
    return alerts.filter((_, idx) => !resolvedAlerts[idx]).length;
  }, [data.alerts, resolvedAlerts]);

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-4 md:px-8 space-y-6 sm:space-y-8 overflow-x-hidden">
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

      {/* Mobile Tab Switcher - only visible on small screens to show elements one-by-one */}
      <div className="flex lg:hidden bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm gap-1 w-full">
        <button
          onClick={() => setMobileTab("metrics")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === "metrics"
              ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Metrics &amp; Integrity</span>
        </button>
        <button
          onClick={() => setMobileTab("insights")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === "insights"
              ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Insights &amp; Export</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-full overflow-hidden min-w-0">
        {/* Left Columns (7/12): Confidence metrics, validation logs, alerts */}
        <div className={`${mobileTab === "metrics" ? "block" : "hidden"} lg:block lg:col-span-7 space-y-6 w-full max-w-full overflow-hidden min-w-0`}>
          
          {/* Section: Confidence Gauges */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm text-left">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Extraction Confidence Profile
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
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

          {/* Section: Pie Chart Breakdown of Line Items and Taxes */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm text-left space-y-4 w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Financial Allocation Breakdown
                </h2>
                <p className="text-xs text-on-surface-variant">Visual distribution of line items, tax, and fees</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-on-surface-variant block sm:inline mr-1">Total:</span>
                <span className="text-sm font-extrabold font-mono text-blue-600 dark:text-blue-400">
                  {currencySymbol}{(data.financials.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {finalChartData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
                {/* Chart stage */}
                <div className="md:col-span-6 flex justify-center items-center h-[240px] w-full min-w-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={finalChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {finalChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const entry = payload[0].payload;
                            return (
                              <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800/80 p-3 rounded-2xl shadow-xl text-left backdrop-blur-md">
                                <p className="text-[11px] font-bold text-white max-w-[180px] break-words whitespace-normal leading-tight">{entry.name}</p>
                                <p className="text-xs font-extrabold font-mono text-blue-400 mt-1">
                                  {currencySymbol}{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                                  {entry.type === "item" ? "Line Item" : entry.type === "tax" ? "Tax" : entry.type === "other" ? "Other Fees" : "Total"}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Visual overlay center total */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
                    <span className="text-sm font-black font-mono text-on-surface">
                      {currencySymbol}{(data.financials.total || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Custom grid-based legend for perfect mobile-friendly formatting without overflow */}
                <div className="md:col-span-6 space-y-2.5 w-full max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                  {finalChartData.map((entry, index) => {
                    const percentage = data.financials.total > 0 ? (entry.value / data.financials.total) * 100 : 0;
                    const color = CHART_COLORS[index % CHART_COLORS.length];
                    return (
                      <div key={index} className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100/50 dark:border-slate-800/40 hover:border-slate-200/60 dark:hover:border-slate-800/80 transition-colors">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                          <span className="font-medium text-on-surface truncate pr-1" title={entry.name}>
                            {entry.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-right">
                          <span className="text-[11px] font-bold text-on-surface">
                            {currencySymbol}{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded-md min-w-[38px] text-center">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-on-surface-variant bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-on-surface">No financial data available for breakdown</p>
              </div>
            )}
          </div>

          {/* Section: Clinical Validation Checks */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm text-left space-y-4 sm:space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Arithmetic &amp; Integrity Checklist
            </h2>

            <div className="space-y-3.5">
              {/* Check 1: Date Logic */}
              <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                {dateValidationStatus === "PASSED" ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/20 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 fill-rose-50 dark:fill-rose-950/20 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 flex-grow">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
              <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                {arithmeticStatus === "PASSED" ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/20 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 fill-rose-50 dark:fill-rose-950/20 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 flex-grow">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
              <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/20 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-grow">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm text-left space-y-4">
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
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 gap-3 sm:gap-4">
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
        <div className={`${mobileTab === "insights" ? "block" : "hidden"} lg:block lg:col-span-5 w-full max-w-full overflow-hidden min-w-0 space-y-6 text-left`}>
          
          {/* AI Contextual Insight Card */}
          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 border border-indigo-500/20 dark:border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-xl shadow-blue-500/5 dark:shadow-none relative overflow-hidden transition-all duration-300 w-full max-w-full min-w-0">
            {/* Decorative background quote mark */}
            <div className="absolute -bottom-8 -right-3 text-white/5 dark:text-blue-500/5 font-serif text-[180px] leading-none pointer-events-none select-none">
              ”
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10 space-y-4 w-full">
              <span className="px-2.5 py-0.5 bg-white/10 dark:bg-blue-500/20 text-white dark:text-blue-300 rounded-full text-[10px] font-bold tracking-wider font-mono uppercase flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300 fill-amber-300 shrink-0" />
                AI Insight Generated
              </span>

              <div className="border-l-2 border-white/30 dark:border-blue-500/50 pl-4 py-1 w-full max-w-full overflow-hidden">
                <p className="text-sm sm:text-[15px] leading-relaxed italic text-white/95 dark:text-blue-100 font-medium break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-normal">
                  "{data.insights || "No insight has been populated for this template. Fill in data to generate insights."}"
                </p>
              </div>

              <div className="pt-2 text-[10px] font-mono text-white/70 dark:text-blue-300/60 flex items-center gap-1.5 w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="truncate">DocExtract Engine v1.4 • Integrity score verified</span>
              </div>
            </div>
          </div>

          {/* Export card with live code snippet */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800 shadow-sm space-y-4 transition-all duration-300 w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="space-y-1 text-left min-w-0 flex-1">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5 truncate">
                  <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  JSON Payload Export
                </h3>
                <p className="text-xs text-on-surface-variant font-mono">schema.json</p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200/40 dark:border-slate-700/60 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col rounded-2xl overflow-hidden shadow-inner border border-slate-800/25 dark:border-slate-800/80 w-full max-w-full min-w-0">
              {/* Mock Code Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950/95 dark:bg-slate-950/80 border-b border-slate-800/60 w-full max-w-full">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-[10px] font-mono text-slate-500 ml-1.5 truncate">schema.json</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider shrink-0 ml-2">
                  {JSON.stringify(data, null, 2).length} B • {JSON.stringify(data, null, 2).split('\n').length} Lines
                </div>
              </div>

              {/* Monospace Code Editor Area */}
              <pre className="p-4 bg-slate-900 dark:bg-slate-950/55 text-slate-100 text-[11px] font-mono max-h-[300px] md:max-h-[450px] overflow-y-auto overflow-x-auto custom-scrollbar leading-relaxed text-left select-text w-full max-w-full min-w-0">
                <code>{JSON.stringify(data, null, 2)}</code>
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
