import { useState } from "react";
import { 
  ArrowRight, Sparkles, Receipt, CreditCard, ShoppingBag, Eye, 
  ShieldCheck, Cpu, CodeXml, Layers, Shield, FileText, CheckCircle, 
  Database, HelpCircle, ChevronDown, RefreshCw, Zap, Server, Code, ClipboardCheck
} from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  onStartExtract: () => void;
  onViewSample: () => void;
}

export default function HomeView({ onStartExtract, onViewSample }: HomeViewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the AI dynamic fallback engine work?",
      answer: "Our system is designed with extreme resilience. When you upload a document, it is primarily routed to Google Gemini for real-time extraction. If an API rate limit, transient error, or latency spike is detected, the engine instantly and seamlessly routes the payload to the secondary OpenRouter fallback, and if needed, to the emergency Groq API. All of this happens in milliseconds, with detailed failover logs visible in the Diagnostics Terminal."
    },
    {
      question: "What validation checks are automatically run on invoices?",
      answer: "Every extraction goes through a three-step Clinical Validation suite: (1) Date Chronology Check: Verifies that issue dates precede or match due dates. (2) Arithmetic Subtotal Verification: Asserts that individual line items calculate to the exact subtotal, and subtotal + tax equals the final total. (3) Currency Code Consistency: Ensures currency notations are identical across all line items and headers."
    },
    {
      question: "Can I export the extracted data to other platforms?",
      answer: "Yes, you can export your data instantly. DocExtract AI supports copying the structured JSON schema to your clipboard, downloading the complete formatted JSON file, or exporting standard CSV tables that map directly into standard accounting tools, ledgers, and ERP software."
    },
    {
      question: "Does the system support handwritten or low-resolution scans?",
      answer: "Yes. Our hybrid visual pipeline automatically detects if your document contains selectable digital text. If it doesn't (such as in photo scans or physical receipts), it utilizes our state-of-the-art OCR layer paired with cognitive visual transformers to read, align, and parse content with remarkable accuracy."
    },
    {
      question: "Is my document data stored permanently?",
      answer: "No. Your data privacy is our highest priority. DocExtract AI processes all uploaded document bytes in-memory and ephemerally. The file content is analyzed to extract structured data and is never stored on permanent physical disks or databases."
    }
  ];

  return (
    <div className="relative overflow-hidden pt-6">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 md:px-12 py-8 sm:py-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-900/40">
              <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Enterprise AI Extraction</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Extract Structured Data from Any Business Document
            </h1>
            
            <p className="text-base sm:text-lg text-on-surface-variant max-w-xl">
              Upload invoices, receipts, or purchase orders and let AI convert them into validated JSON within seconds. Automate your data entry with clinical precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={onStartExtract}
                className="bg-primary text-white hover:bg-blue-700 font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                Extract Document
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onViewSample}
                className="bg-surface-container-lowest text-primary border border-outline-variant dark:border-outline-variant/20 hover:bg-surface-container font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Eye className="w-5 h-5" />
                View Sample
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative group justify-self-center lg:justify-self-end w-full max-w-lg"
          >
            <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity pointer-events-none"></div>
            <img 
              className="relative z-10 w-full rounded-2xl shadow-2xl border border-slate-200/50"
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqwJ8xVykBNiw7fpwaLDPSAkAyESJO7NujxRv-xPqtSzYLtsNp42vMFFuZ52B4JWrv0iOGZ21QIj6Cc1cpakTGLD06xvx4C0LFjFYBYQaUYIPcpD57MSJaNWVNsFEAWPbSE6nMQx6ckTWeQdhvQR3QmcTyOBixneusI5X9MqHYWpigqjelKIq6YPtb0QzztXtxGfqi_JcatCcXlLAlz_dyyWOo2luR3Q1WwidbrfB4uRXpxffo" 
              alt="High-fidelity 3D visualization showing business documents flowing into a glowing AI network node"
            />
          </motion.div>
        </div>
      </section>

      {/* Supported Documents */}
      <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Supported Document Types</h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-2xl mx-auto">Built-in templates optimized for standard enterprise documents, mapping raw pixels directly to verified objects.</p>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Invoices</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              Extract line items, tax details, vendor info, payment terms, and bank accounts automatically.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Receipts</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              Process complex retail and travel receipts with deep localized OCR for reimbursement tracking.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300 text-left">
            <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Purchase Orders</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              Map elaborate ordering tables, nested delivery schedules, and shipping rates directly.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - Workflow Section */}
      <section className="bg-slate-50 dark:bg-slate-950 border-t border-b border-outline-variant/30 dark:border-slate-900/60 px-4 sm:px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Extraction Processing Pipeline</h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-2xl mx-auto">Learn about the sequence of technologies that turn raw PDF files and receipt photos into pristine data structures.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 dark:border-slate-900 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold text-base mb-4 shadow-md">1</div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Ingest &amp; Standardize</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Accepts multi-page PDFs, images, and scans up to 10MB in size.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 dark:border-slate-900 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold text-base mb-4 shadow-md">2</div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Hybrid Visual OCR</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Automatically switches between native text-layer reads and transformer-based raster OCR.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 dark:border-slate-900 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold text-base mb-4 shadow-md">3</div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Cognitive Parsing</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Primary Gemini engines extract raw nested properties, fields, and tabular grids.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center text-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 dark:border-slate-900 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold text-base mb-4 shadow-md">4</div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Pragmatic Audits</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Runs math recalculations ($Subtotal + Tax$) and date chronology rules to spot errors.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative z-10 flex flex-col items-center text-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 dark:border-slate-900 shadow-sm">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-extrabold text-base mb-4 shadow-md">5</div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Downstream Ready</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Emits clean validation scores, custom alerts, structured CSV, and compliant JSON payloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-surface-container-low border-b border-outline-variant/30 px-4 sm:px-6 md:px-12 py-16" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Powerful AI Extraction Suite</h2>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-1">Our multi-layered model pipeline and intelligent validation layers ensure clinical precision at every stage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-base font-bold mb-2">Cognitive Core Logic</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Contextual LLM-based parsing that understands the semantic meaning behind complex and non-standard lines.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-base font-bold mb-2">High-Fidelity OCR</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  State-of-the-art vision transformers to read even blurry scans, crumpled receipts, or dark photographs.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center mb-6">
                <CodeXml className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-base font-bold mb-2">Structured JSON Output</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Ready-to-use JSON objects conforming to standard schemas. Perfect for database storage and system syncing.
                </p>
              </div>
            </div>

            {/* Feature row 2 */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <Server className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-base font-bold mb-2">Fault-Tolerant Failover</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Dual-provider architecture seamlessly falls back from Gemini to secondary APIs to maximize system uptime.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-base font-bold mb-2">Arithmetic Assertions</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Automatically flags when invoice sub-line additions do not add up to the stated total values.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-base font-bold mb-2">Interactive Spreadsheet</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Instantly edit extracted lines on the fly to correct rare OCR misreads before final JSON/CSV output.
                </p>
              </div>
            </div>

            {/* Feature Highlight card */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow md:col-span-3 text-left">
              <div className="grid md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold mb-1">Automated Quality Controls</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Every single element extracted passes through a detailed certainty gauge. Set confidence bars to auto-approve high-quality logs.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-8 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-outline-variant/20 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-500 uppercase">Verification Rules Dashboard</span>
                    <span className="text-[10px] font-bold bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">ACTIVE</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-on-surface">Date Logic:</span>
                      <span className="text-on-surface-variant">Issue Date precedes or matches the Payment Due Date.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-on-surface">Arithmetic Alignment:</span>
                      <span className="text-on-surface-variant">Sum of individual items matches the subtotal value.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-on-surface">Currency Code Uniformity:</span>
                      <span className="text-on-surface-variant">All extracted monetary figures use a uniform currency.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-4xl mx-auto text-left">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Frequently Asked Questions</h2>
          <p className="text-sm text-on-surface-variant mt-2">Everything you need to know about DocExtract AI processing.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 dark:border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-on-surface hover:text-primary transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform shrink-0 ml-3 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-on-surface-variant border-t border-slate-100 dark:border-slate-900 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA section */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-7xl mx-auto text-center">
        <div className="bg-primary rounded-3xl p-8 sm:p-12 relative overflow-hidden text-white shadow-xl">
          <div className="absolute inset-0 bg-blue-800 opacity-20 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Ready to automate your data entry?</h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-lg mx-auto">
              Join hundreds of enterprise companies saving thousands of hours of manual entry every month with DocExtract AI.
            </p>
            <div className="flex justify-center pt-2">
              <button 
                onClick={onStartExtract}
                className="bg-white text-primary hover:bg-blue-50 font-extrabold px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 duration-150 text-sm sm:text-base min-h-[44px]"
              >
                Start Extracting Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

