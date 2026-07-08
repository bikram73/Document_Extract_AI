import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg border text-xs font-bold backdrop-blur-md transition-colors ${
                toast.type === "success"
                  ? "bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border-slate-200/60 dark:border-slate-800 shadow-slate-500/5"
                  : toast.type === "error"
                  ? "bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border-red-200/40 dark:border-red-950/40 shadow-red-500/5"
                  : "bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border-blue-200/40 dark:border-blue-950/40 shadow-blue-500/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                {toast.type === "error" && (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                {toast.type === "info" && (
                  <Info className="w-4 h-4 text-blue-500 shrink-0" />
                )}
                <span className="leading-tight">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
