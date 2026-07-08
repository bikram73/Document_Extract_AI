import { ArrowRight, Sparkles, Receipt, CreditCard, ShoppingBag, Eye, ShieldCheck, Cpu, CodeXml, Layers, Shield } from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  onStartExtract: () => void;
  onViewSample: () => void;
}

export default function HomeView({ onStartExtract, onViewSample }: HomeViewProps) {
  return (
    <div className="relative overflow-hidden pt-6">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Extract Structured Data from Any Business Document
            </h1>
            
            <p className="text-lg text-on-surface-variant max-w-xl">
              Upload invoices, receipts, or purchase orders and let AI convert them into validated JSON within seconds. Automate your data entry with clinical precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={onStartExtract}
                className="bg-primary text-white hover:bg-blue-700 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Extract Document
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onViewSample}
                className="bg-surface-container-lowest text-primary border border-outline-variant dark:border-outline-variant/20 hover:bg-surface-container font-semibold px-8 py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
      <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-on-surface">Supported Document Types</h2>
          <p className="text-sm text-on-surface-variant mt-2">Built-in templates optimized for standard enterprise documents</p>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Invoices</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              Extract line items, tax details, vendor info, and payment terms automatically.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Receipts</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              Process retail and travel receipts with high accuracy for expense tracking.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Purchase Orders</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              Map complex ordering tables and delivery schedules into your internal systems.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-surface-container-low border-y border-outline-variant/30 px-6 md:px-12 py-16" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-left">
            <h2 className="text-2xl font-bold text-on-surface">Powerful AI Extraction</h2>
            <p className="text-sm text-on-surface-variant max-w-md mt-1">Our multi-layered model pipeline ensures clinical precision at every phase of processing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold mb-2">AI Document Understanding</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Contextual LLM-based parsing that understands the semantic meaning behind every field.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold mb-2">High-Fidelity OCR</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  State-of-the-art visual transformers for reading even the most challenging or blurry document scans.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center mb-6">
                <CodeXml className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold mb-2">Structured JSON Output</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Ready-to-use JSON objects conforming to standard schemas that integrate into ERP systems.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow md:col-span-1">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold mb-2">Multi-Layout Support</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  No layout templates or rules to write. AI adapts seamlessly to varied layouts out of the box.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <h4 className="text-base font-bold mb-2">Confidence Scores &amp; Validation</h4>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Every extracted field is processed with detailed confidence logs. Set automated quality thresholds to route reviews instantly.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-xs font-semibold border border-green-200 dark:border-green-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  High (98%)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Medium (82%)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Review Required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto text-center">
        <div className="bg-primary rounded-3xl p-12 relative overflow-hidden text-white shadow-xl">
          <div className="absolute inset-0 bg-blue-800 opacity-20 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to automate your data entry?</h2>
            <p className="text-base text-blue-100 max-w-lg mx-auto">
              Join hundreds of enterprise companies saving thousands of hours of manual entry every month with DocExtract AI.
            </p>
            <div className="flex justify-center pt-2">
              <button 
                onClick={onStartExtract}
                className="bg-white text-primary hover:bg-blue-50 font-extrabold px-10 py-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 duration-150 text-base"
              >
                Start Extract Document
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
