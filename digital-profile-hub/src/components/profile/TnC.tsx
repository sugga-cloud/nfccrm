import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TermsLegalSectionProps {
  data: any;
  theme: any; 
  ui: any;    
}

const TermsLegalSection = ({ data, theme, ui }: TermsLegalSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Robust data check: handles [ {data} ], {data}, or null
  const legalData = Array.isArray(data) ? data[0] : data;
  if (!legalData || !legalData.content) return null;

  const isGlass = ui.id === "glass";

  return (
    <>
      {/* 1. FOOTER LINK - Uses theme.text and theme.bg to blend in */}
      <footer className={cn("relative z-10 w-full py-16 mt-20 flex flex-col items-center gap-4 transition-colors duration-500", theme.bg)}>
        <button 
          onClick={() => setIsOpen(true)}
          className={cn(
            "group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300",
            theme.text, "opacity-40 hover:opacity-100"
          )}
        >
          <ScrollText className={cn("h-3 w-3 transition-transform group-hover:scale-110", theme.primary)} />
          <span>{legalData.title || "Terms & Conditions"}</span>
        </button>
      </footer>

      {/* 2. ADAPTIVE LEGAL MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop: Uses a tinted version of the theme background if possible, otherwise dark blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card: Removed hardcoded 'bg-white' */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className={cn(
                "relative w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border shadow-2xl transition-all duration-500",
                theme.card, // This should contain your theme's specific background color (e.g., bg-slate-900 or bg-white)
                theme.border,
                isGlass && "backdrop-blur-3xl"
              )}
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl bg-current bg-opacity-10", theme.primary)}>
                    <Scale className={cn("h-6 w-6", theme.primary)} />
                  </div>
                  <div>
                    <h3 className={cn("text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none", theme.text)}>
                      {legalData.title || "Terms of Service"}
                    </h3>
                    <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1", theme.text)}>
                      Legal Agreement
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className={cn("p-2 rounded-full transition-all hover:bg-current hover:bg-opacity-10", theme.text)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                <div className={cn(
                  "whitespace-pre-wrap leading-relaxed text-sm md:text-base font-medium opacity-70",
                  theme.text
                )}>
                  {legalData.content}
                </div>
              </div>

              {/* Action Footer: Uses bg-current bg-opacity-5 to stay within the same color family */}
              <div className={cn("p-6 border-t border-white/10 flex justify-end items-center gap-4 bg-current bg-opacity-5")}>
                 <span className={cn("hidden sm:block text-[10px] font-black uppercase tracking-widest opacity-30", theme.text)}>
                   Review Agreement
                 </span>
                 <button 
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg",
                    theme.accent, // e.g., 'bg-orange-500'
                    theme.accentContent || "text-white"
                  )}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128,128,128,0.2);
          border-radius: 10px;
        }
      `}} />
    </>
  );
};

export default TermsLegalSection;