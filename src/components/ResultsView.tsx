import { useState, useMemo } from "react";
import { 
  FileText, Copy, Check, Save, Plus, Trash2, Edit2, Info, ListCollapse, 
  HelpCircle, Sparkles, Building, Calendar, DollarSign, Percent, ShieldCheck, FileCheck
} from "lucide-react";
import { ExtractedData, LineItem } from "../types";

interface ResultsViewProps {
  data: ExtractedData;
  fileName: string;
  fileSize: string;
  onUpdateData: (updated: ExtractedData) => void;
  onGoToAnalytics: () => void;
  providerUsed?: string;
  providerReason?: string;
  providerLogs?: any[];
}

export default function ResultsView({ 
  data, 
  fileName, 
  fileSize, 
  onUpdateData, 
  onGoToAnalytics,
  providerUsed = "gemini",
  providerReason = "Primary Provider",
  providerLogs = []
}: ResultsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"general" | "items" | "json" | "fallback">("general");
  const [copied, setCopied] = useState(false);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  // Copy helper
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Field change handlers
  const handleFieldChange = (field: string, value: any) => {
    onUpdateData({
      ...data,
      [field]: value
    });
  };

  const handleFinancialChange = (subField: "subtotal" | "tax" | "total", value: number) => {
    onUpdateData({
      ...data,
      financials: {
        ...data.financials,
        [subField]: value
      }
    });
  };

  // Line item change handlers
  const handleLineItemChange = (index: number, subField: keyof LineItem, value: any) => {
    if (!data.lineItems) return;
    const items = [...data.lineItems];
    items[index] = {
      ...items[index],
      [subField]: value
    };

    // Auto-calculate amount if qty or unitPrice changes
    if (subField === "qty" || subField === "unitPrice") {
      const q = subField === "qty" ? Number(value) : Number(items[index].qty);
      const p = subField === "unitPrice" ? Number(value) : Number(items[index].unitPrice);
      items[index].amount = Number((q * p).toFixed(2));
    }

    onUpdateData({
      ...data,
      lineItems: items
    });
  };

  const handleAddLineItem = () => {
    const items = data.lineItems ? [...data.lineItems] : [];
    items.push({
      description: "New Extracted Item",
      qty: 1,
      unitPrice: 0.0,
      amount: 0.0
    });
    onUpdateData({
      ...data,
      lineItems: items
    });
  };

  const handleDeleteLineItem = (index: number) => {
    if (!data.lineItems) return;
    const items = data.lineItems.filter((_, i) => i !== index);
    onUpdateData({
      ...data,
      lineItems: items
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-8 space-y-6">
      {/* Top action header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-on-surface flex flex-wrap items-center gap-2">
              Structured Workbench 
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                {data.documentType || "Processed Document"}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                providerUsed === "gemini" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                  : providerUsed === "openrouter" 
                  ? "bg-amber-50 text-amber-700 border border-amber-100" 
                  : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  providerUsed === "gemini" 
                    ? "bg-emerald-500 animate-pulse" 
                    : providerUsed === "openrouter" 
                    ? "bg-amber-500" 
                    : "bg-rose-500"
                }`}></span>
                Engine: {providerUsed === "gemini" ? "Google Gemini" : providerUsed === "openrouter" ? "OpenRouter" : "Groq"}
              </span>
            </h1>
            <p className="text-xs text-on-surface-variant font-mono">
              Source: {fileName} ({fileSize})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToAnalytics}
            className="w-full sm:w-auto bg-primary text-white hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            Run Integrity &amp; Metrics &rarr;
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Scanned Document Visualization */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200/50 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 font-mono">SCANNED DOCUMENT CANVAS</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                OCR Hover Overlays Active
              </span>
            </div>

            {/* Simulated Printed Document Canvas */}
            <div className="relative bg-white aspect-[3/4] rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar text-left document-canvas select-none">
              
              {/* Document Header */}
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  {/* Vendor Overlay */}
                  <div 
                    onMouseEnter={() => setHoveredField("vendor")}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`relative p-2 rounded-lg transition-all border ${
                      hoveredField === "vendor" 
                        ? "bg-blue-100/30 border-blue-600 shadow-md ring-2 ring-blue-400/20" 
                        : "border-dashed border-slate-300"
                    }`}
                  >
                    <div className="absolute -top-3.5 left-2 px-1 text-[8px] font-bold text-blue-700 bg-blue-100 rounded-full font-mono">
                      VENDOR
                    </div>
                    <p className="font-extrabold text-lg text-slate-900 tracking-tight">
                      {data.vendorName || "Stripe Payments UK"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">Tax ID: {data.vendorTaxId || "GB 123 456 789"}</p>
                  </div>

                  {/* Document metadata overlay */}
                  <div className="text-right space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                      {data.documentType?.toUpperCase() || "INVOICE"}
                    </span>
                    
                    <div 
                      onMouseEnter={() => setHoveredField("invoiceNumber")}
                      onMouseLeave={() => setHoveredField(null)}
                      className={`relative p-1 rounded transition-all border ${
                        hoveredField === "invoiceNumber" 
                          ? "bg-blue-100/30 border-blue-600 shadow" 
                          : "border-transparent"
                      }`}
                    >
                      <p className="text-xs font-mono font-bold text-slate-800">
                        No: {data.invoiceNumber || "INV-2024-88412"}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Date & Terms Overlays */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">DATE OF PURCHASE</span>
                    <div 
                      onMouseEnter={() => setHoveredField("issueDate")}
                      onMouseLeave={() => setHoveredField(null)}
                      className={`relative inline-block px-1.5 py-0.5 rounded transition-all border ${
                        hoveredField === "issueDate" 
                          ? "bg-blue-100/30 border-blue-600" 
                          : "border-transparent"
                      }`}
                    >
                      <span className="font-semibold text-slate-800">{data.issueDate || "Oct 24, 2024"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">PAYMENT TERMS</span>
                    <div 
                      onMouseEnter={() => setHoveredField("paymentTerms")}
                      onMouseLeave={() => setHoveredField(null)}
                      className={`relative inline-block px-1.5 py-0.5 rounded transition-all border ${
                        hoveredField === "paymentTerms" 
                          ? "bg-blue-100/30 border-blue-600" 
                          : "border-transparent"
                      }`}
                    >
                      <span className="font-semibold text-slate-800">{data.paymentTerms || "Net 30"}</span>
                    </div>
                  </div>
                </div>

                {/* Items Grid Overlay */}
                <div className="space-y-2 pt-4">
                  <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-1.5 font-mono">
                    <span className="col-span-8">DESCRIPTION</span>
                    <span className="col-span-1 text-center">QTY</span>
                    <span className="col-span-3 text-right">AMOUNT</span>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                    {data.lineItems?.map((item, index) => (
                      <div 
                        key={index}
                        onMouseEnter={() => setHoveredField(`item-${index}`)}
                        onMouseLeave={() => setHoveredField(null)}
                        className={`grid grid-cols-12 text-xs py-1.5 px-1 rounded transition-all border ${
                          hoveredField === `item-${index}` 
                            ? "bg-blue-50 border-blue-400 shadow-sm" 
                            : "border-transparent"
                        }`}
                      >
                        <span className="col-span-8 font-medium text-slate-700 truncate pr-2">{item.description}</span>
                        <span className="col-span-1 text-center font-mono text-slate-500">{item.qty}</span>
                        <span className="col-span-3 text-right font-bold text-slate-800">
                          {data.currency?.includes("EUR") ? "€" : data.currency?.includes("GBP") ? "£" : "$"}
                          {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Financial Totals Overlays */}
              <div className="border-t border-slate-100 pt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <div 
                    onMouseEnter={() => setHoveredField("subtotal")}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`relative px-1 rounded transition-all border ${
                      hoveredField === "subtotal" ? "bg-blue-100/30 border-blue-600" : "border-transparent"
                    }`}
                  >
                    <span>
                      {data.currency?.includes("EUR") ? "€" : data.currency?.includes("GBP") ? "£" : "$"}
                      {(data.financials.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Tax Amount</span>
                  <div 
                    onMouseEnter={() => setHoveredField("tax")}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`relative px-1 rounded transition-all border ${
                      hoveredField === "tax" ? "bg-blue-100/30 border-blue-600" : "border-transparent"
                    }`}
                  >
                    <span>
                      {data.currency?.includes("EUR") ? "€" : data.currency?.includes("GBP") ? "£" : "$"}
                      {(data.financials.tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-100">
                  <span>Total Amount</span>
                  <div 
                    onMouseEnter={() => setHoveredField("total")}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`relative px-2 py-0.5 rounded-lg transition-all border ${
                      hoveredField === "total" 
                        ? "bg-blue-100/30 border-blue-600 shadow font-black" 
                        : "border-transparent"
                    }`}
                  >
                    <span className="text-blue-700">
                      {data.currency?.includes("EUR") ? "€" : data.currency?.includes("GBP") ? "£" : "$"}
                      {data.financials.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Structured Workbench Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          {/* Section Tabs */}
          <div className="flex border-b border-outline-variant/30 bg-slate-50 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab("general")}
              className={`flex-1 min-w-[120px] py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeSubTab === "general" 
                  ? "border-primary text-primary bg-white" 
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-slate-100/50"
              }`}
            >
              General Info
            </button>
            <button
              onClick={() => setActiveSubTab("items")}
              className={`flex-1 min-w-[120px] py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeSubTab === "items" 
                  ? "border-primary text-primary bg-white" 
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-slate-100/50"
              }`}
            >
              Line Items ({data.lineItems?.length || 0})
            </button>
            <button
              onClick={() => setActiveSubTab("json")}
              className={`flex-1 min-w-[100px] py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeSubTab === "json" 
                  ? "border-primary text-primary bg-white" 
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-slate-100/50"
              }`}
            >
              Raw JSON
            </button>
            <button
              onClick={() => setActiveSubTab("fallback")}
              className={`flex-1 min-w-[150px] py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeSubTab === "fallback" 
                  ? "border-primary text-primary bg-white" 
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-slate-100/50"
              }`}
            >
              Fallback Engine
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 text-left min-h-[440px]">
            
            {/* SUBTAB 1: GENERAL INFO */}
            {activeSubTab === "general" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Vendor Name */}
                  <div 
                    onMouseEnter={() => setHoveredField("vendor")}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`space-y-2 p-3 rounded-xl transition-all ${
                      hoveredField === "vendor" ? "bg-blue-50/50 ring-1 ring-blue-200" : ""
                    }`}
                  >
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" /> Vendor Name
                    </label>
                    <input
                      type="text"
                      value={data.vendorName || ""}
                      onChange={(e) => handleFieldChange("vendorName", e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Vendor Tax ID */}
                  <div className="space-y-2 p-3 rounded-xl">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      Tax ID / VAT Registration
                    </label>
                    <input
                      type="text"
                      value={data.vendorTaxId || ""}
                      onChange={(e) => handleFieldChange("vendorTaxId", e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Invoice Number */}
                  <div 
                    onMouseEnter={() => setHoveredField("invoiceNumber")}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`space-y-2 p-3 rounded-xl transition-all ${
                      hoveredField === "invoiceNumber" ? "bg-blue-50/50 ring-1 ring-blue-200" : ""
                    }`}
                  >
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      Document Number
                    </label>
                    <input
                      type="text"
                      value={data.invoiceNumber || ""}
                      onChange={(e) => handleFieldChange("invoiceNumber", e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all font-mono"
                    />
                  </div>

                  {/* Payment Terms */}
                  <div 
                    onMouseEnter={() => setHoveredField("paymentTerms")}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`space-y-2 p-3 rounded-xl transition-all ${
                      hoveredField === "paymentTerms" ? "bg-blue-50/50 ring-1 ring-blue-200" : ""
                    }`}
                  >
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      Payment Terms
                    </label>
                    <input
                      type="text"
                      value={data.paymentTerms || ""}
                      onChange={(e) => handleFieldChange("paymentTerms", e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Issue Date */}
                  <div 
                    onMouseEnter={() => setHoveredField("issueDate")}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`space-y-2 p-3 rounded-xl transition-all ${
                      hoveredField === "issueDate" ? "bg-blue-50/50 ring-1 ring-blue-200" : ""
                    }`}
                  >
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date of Issue
                    </label>
                    <input
                      type="text"
                      value={data.issueDate || ""}
                      onChange={(e) => handleFieldChange("issueDate", e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2 p-3 rounded-xl">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Due Date
                    </label>
                    <input
                      type="text"
                      value={data.dueDate || ""}
                      onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Currency */}
                  <div className="space-y-2 p-3 rounded-xl">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      Currency Code
                    </label>
                    <input
                      type="text"
                      value={data.currency || ""}
                      onChange={(e) => handleFieldChange("currency", e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Document Category Type */}
                  <div className="space-y-2 p-3 rounded-xl">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      Document Classification
                    </label>
                    <select
                      value={data.documentType || ""}
                      onChange={(e) => handleFieldChange("documentType", e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                    >
                      <option value="Invoice">Invoice</option>
                      <option value="Service Invoice">Service Invoice</option>
                      <option value="Receipt">Receipt</option>
                      <option value="Purchase Order">Purchase Order</option>
                      <option value="Document">Generic Document</option>
                    </select>
                  </div>
                </div>

                {/* Financial Totals form section */}
                <div className="border-t border-slate-100 pt-6 mt-6">
                  <h3 className="text-sm font-bold text-on-surface mb-4">Financial Breakdown</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Subtotal */}
                    <div 
                      onMouseEnter={() => setHoveredField("subtotal")}
                      onMouseLeave={() => setHoveredField(null)}
                      className={`space-y-1.5 p-3 rounded-xl transition-all ${
                        hoveredField === "subtotal" ? "bg-blue-50/50 ring-1 ring-blue-200" : ""
                      }`}
                    >
                      <label className="text-xs font-semibold text-on-surface-variant">Subtotal</label>
                      <input
                        type="number"
                        step="0.01"
                        value={data.financials.subtotal || 0}
                        onChange={(e) => handleFinancialChange("subtotal", parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-3 py-2 rounded-xl text-sm font-bold transition-all"
                      />
                    </div>

                    {/* Tax */}
                    <div 
                      onMouseEnter={() => setHoveredField("tax")}
                      onMouseLeave={() => setHoveredField(null)}
                      className={`space-y-1.5 p-3 rounded-xl transition-all ${
                        hoveredField === "tax" ? "bg-blue-50/50 ring-1 ring-blue-200" : ""
                      }`}
                    >
                      <label className="text-xs font-semibold text-on-surface-variant">Tax Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={data.financials.tax || 0}
                        onChange={(e) => handleFinancialChange("tax", parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-outline-variant/50 focus:border-primary focus:bg-white px-3 py-2 rounded-xl text-sm font-bold transition-all"
                      />
                    </div>

                    {/* Total */}
                    <div 
                      onMouseEnter={() => setHoveredField("total")}
                      onMouseLeave={() => setHoveredField(null)}
                      className={`space-y-1.5 p-3 rounded-xl transition-all ${
                        hoveredField === "total" ? "bg-blue-50/50 ring-1 ring-blue-200" : ""
                      }`}
                    >
                      <label className="text-xs font-semibold text-primary font-bold">Total Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={data.financials.total}
                        onChange={(e) => handleFinancialChange("total", parseFloat(e.target.value) || 0)}
                        className="w-full bg-blue-50/30 border border-blue-200 focus:border-primary focus:bg-white px-3 py-2 rounded-xl text-sm font-bold text-blue-700 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: LINE ITEMS */}
            {activeSubTab === "items" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-on-surface-variant">
                    Verify and edit line item records read by the visual OCR engine.
                  </p>
                  
                  <button
                    onClick={handleAddLineItem}
                    className="bg-blue-50 text-primary border border-blue-100 hover:bg-blue-100/50 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Row
                  </button>
                </div>

                {/* Responsive spreadsheet-like table */}
                <div className="border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-outline-variant/30 text-on-surface-variant font-bold">
                          <th className="py-3 px-4 w-10">#</th>
                          <th className="py-3 px-4 min-w-[200px]">Description</th>
                          <th className="py-3 px-4 w-16 text-center">Qty</th>
                          <th className="py-3 px-4 w-28 text-right font-mono">Unit Price</th>
                          <th className="py-3 px-4 w-28 text-right font-mono">Total Amount</th>
                          <th className="py-3 px-4 w-12 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.lineItems && data.lineItems.length > 0 ? (
                          data.lineItems.map((item, index) => (
                            <tr 
                              key={index}
                              onMouseEnter={() => setHoveredField(`item-${index}`)}
                              onMouseLeave={() => setHoveredField(null)}
                              className={`transition-all hover:bg-slate-50/50 ${
                                hoveredField === `item-${index}` ? "bg-blue-50/30" : ""
                              }`}
                            >
                              <td className="py-2.5 px-4 font-bold text-on-surface-variant">{index + 1}</td>
                              
                              <td className="py-2.5 px-4">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                                  className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:bg-white px-1.5 py-1 rounded text-on-surface font-medium transition-all"
                                />
                              </td>

                              <td className="py-2.5 px-4 text-center">
                                <input
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => handleLineItemChange(index, "qty", parseInt(e.target.value) || 0)}
                                  className="w-12 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:border-primary focus:bg-white py-1 rounded font-mono"
                                />
                              </td>

                              <td className="py-2.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1 text-right">
                                  <span>{data.currency?.includes("EUR") ? "€" : data.currency?.includes("GBP") ? "£" : "$"}</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.unitPrice}
                                    onChange={(e) => handleLineItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                                    className="w-20 bg-transparent text-right border-b border-transparent hover:border-slate-300 focus:border-primary focus:bg-white py-1 rounded font-mono font-semibold"
                                  />
                                </div>
                              </td>

                              <td className="py-2.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1 justify-end font-bold text-on-surface text-right w-full">
                                  <span>{data.currency?.includes("EUR") ? "€" : data.currency?.includes("GBP") ? "£" : "$"}</span>
                                  <span className="font-mono">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                              </td>

                              <td className="py-2.5 px-4 text-center">
                                <button
                                  onClick={() => handleDeleteLineItem(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-8 px-4 text-center text-on-surface-variant font-medium">
                              No line items found. Click "Add Row" to append items.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 3: RAW JSON PAYLOAD */}
            {activeSubTab === "json" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-on-surface-variant">
                    Standardized, schemas-validated JSON response returned by the backend server.
                  </p>
                  
                  <button
                    onClick={handleCopyJSON}
                    className="bg-blue-50 text-primary hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-5 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[380px] custom-scrollbar border border-slate-800 text-left">
                    <code>
                      {JSON.stringify(data, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {/* SUBTAB 4: FALLBACK ENGINE DIAGNOSTICS */}
            {activeSubTab === "fallback" && (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-xs space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 uppercase tracking-wide">Fallback Engine Blueprint</span>
                    <span className="px-2 py-0.5 font-bold text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      SYSTEM ONLINE
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-[11px] pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Primary</span>
                      <span className="font-semibold text-slate-800">Google Gemini</span>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">Priority 1</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Fallback</span>
                      <span className="font-semibold text-slate-800">OpenRouter</span>
                      <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-bold">Priority 2</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Final Fallback</span>
                      <span className="font-semibold text-slate-800">Groq Engine</span>
                      <span className="text-[9px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full font-bold">Priority 3</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm text-xs space-y-3 text-left">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    Orchestrator Decision
                  </h4>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Selected Provider</span>
                      <span className="text-xs font-semibold text-blue-700 capitalize">{providerUsed}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Failover Reason</span>
                      <span className="text-xs font-medium text-slate-600">{providerReason}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <h4 className="font-bold text-slate-800 text-sm">Execution Traces &amp; Memory Logs</h4>
                  
                  <div className="relative border-l-2 border-slate-150 ml-4 pl-6 space-y-5">
                    {providerLogs && providerLogs.length > 0 ? (
                      providerLogs.map((log: any, idx: number) => {
                        const isSuccess = log.event === "SUCCESS";
                        const isFailed = log.event === "FAILED";
                        const isSkipped = log.event === "SKIPPED";
                        
                        return (
                          <div key={idx} className="relative">
                            {/* Dot */}
                            <span className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                              isSuccess 
                                ? "border-emerald-500" 
                                : isFailed 
                                ? "border-rose-500" 
                                : isSkipped
                                ? "border-amber-400"
                                : "border-blue-500"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isSuccess 
                                  ? "bg-emerald-500" 
                                  : isFailed 
                                  ? "bg-rose-500" 
                                  : isSkipped
                                  ? "bg-amber-400"
                                  : "bg-blue-500"
                              }`}></span>
                            </span>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-800 capitalize">{log.provider}</span>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                                  isSuccess 
                                    ? "bg-emerald-50 text-emerald-700" 
                                    : isFailed 
                                    ? "bg-rose-50 text-rose-700" 
                                    : isSkipped
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}>
                                  {log.event}
                                </span>
                                {log.latencyMs !== undefined && (
                                  <span className="text-[10px] font-mono text-slate-400">
                                    ({log.latencyMs}ms)
                                  </span>
                                )}
                                <span className="text-[9px] text-slate-400 font-mono ml-auto">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-slate-600 text-xs leading-relaxed">{log.message}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-400 italic text-xs">No diagnostics traces available for this session.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
