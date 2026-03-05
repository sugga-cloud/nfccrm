import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: number;
  type: "image" | "video";
  media_url: string;
  title: string;
}

interface GallerySectionProps {
  gallery: GalleryItem[] | null;
  theme: any; 
  ui: any;    
}

const GallerySection = ({ gallery, theme, ui }: GallerySectionProps) => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!gallery || gallery.length === 0) return null;

  // Layout configurations mapping
  const layouts = {
    classic: { card: "rounded-none border-2", gap: "gap-2", header: "items-center text-center", grid: "grid-cols-2 md:grid-cols-4" },
    modern: { card: "rounded-[3rem] border-none shadow-2xl", gap: "gap-8", header: "items-center text-center", grid: "grid-cols-1 md:grid-cols-3" },
    glass: { card: "rounded-[2rem] backdrop-blur-xl bg-white/5 border-white/20 shadow-none", gap: "gap-6", header: "items-center text-center", grid: "grid-cols-2 md:grid-cols-3" },
    minimal: { card: "rounded-3xl border-none shadow-none bg-secondary/10", gap: "gap-4", header: "items-start text-left", grid: "grid-cols-2 md:grid-cols-3" },
    bento: { card: "rounded-[2.5rem] border-2 shadow-none", gap: "gap-4", header: "items-center text-center", grid: "grid-cols-2 md:grid-cols-3" },
  };

  const style = layouts[ui.id as keyof typeof layouts] || layouts.modern;
  const isSlider = ui.id === "modern" || ui.id === "glass";

  return (
    <section className={cn("relative w-full py-24 overflow-hidden transition-all duration-500", theme.bg, ui.spacing)}>
      
      {/* 1. Animated Background Blobs (Synced across sections) */}
      {ui.id !== "classic" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              x: [-50, 50, -50], 
              y: [0, 100, 0],
              rotate: [0, 45, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className={cn("absolute top-[10%] left-[5%] w-[45%] h-[45%] rounded-full blur-[130px] opacity-[0.12]", theme.primary)} 
          />
          <motion.div 
            animate={{ 
              x: [50, -50, 50], 
              y: [100, 0, 100],
              rotate: [0, -45, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className={cn("absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full blur-[130px] opacity-[0.1]", theme.accent)} 
          />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn("flex flex-col mb-16", style.header)}
        >
          <div className="flex items-center gap-2 mb-3">
             <Sparkles className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>
                Portfolio
             </span>
          </div>
          <h2 className={cn("text-3xl md:text-5xl font-bold tracking-tighter leading-none", theme.text)}>
            Media <span className={theme.primary}>Gallery</span>
          </h2>
          {ui.id !== "minimal" && (
            <div className={cn("w-16 h-1 mt-6 rounded-full", theme.accent, ui.id === "classic" && "rounded-none")} />
          )}
        </motion.div>

        {/* Dynamic Layout List */}
        <div 
          ref={scrollRef}
          className={cn(
            "scrollbar-hide transition-all duration-700",
            style.gap,
            isSlider 
              ? "flex overflow-x-auto snap-x snap-mandatory pb-12 px-4 -mx-4" 
              : `grid ${style.grid}`
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {gallery.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              onClick={() => setSelected(item)}
              className={cn(
                "relative overflow-hidden group transition-all duration-700 aspect-square outline-none border",
                theme.card, theme.border, style.card,
                isSlider ? "flex-none w-[85vw] sm:w-[450px] snap-center shadow-2xl" : "w-full",
                ui.id === "bento" && (index % 4 === 0 ? "md:col-span-2 md:aspect-[21/9]" : ""),
                "hover:translate-y-[-8px] hover:shadow-2xl active:scale-95"
              )}
            >
              <img
                src={item.media_url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Center Play Icon for Videos */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "p-5 rounded-full shadow-2xl backdrop-blur-md transition-all",
                      theme.accent, theme.accentContent || "text-white"
                    )}
                  >
                    <PlayCircle className="h-8 w-8 fill-current" />
                  </motion.div>
                </div>
              )}

              {/* Bottom Label */}
              <div className="absolute inset-x-0 bottom-0 p-8 text-left translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className={cn("inline-block px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase mb-3", theme.accent, theme.accentContent)}>
                  {item.type}
                </span>
                <p className="text-white text-lg font-bold tracking-tight">
                  {item.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog - Logic Integrated */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className={cn(
          "max-w-[95vw] sm:max-w-5xl p-0 border-none shadow-2xl overflow-hidden bg-transparent z-[999]",
          style.card
        )}>
          {selected && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className={cn("relative flex flex-col", theme.card, ui.id === "glass" && "backdrop-blur-3xl bg-white/10")}
            >
              {/* Header inside Lightbox */}
              <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50 pointer-events-none">
                <div className={cn("px-4 py-2 rounded-full backdrop-blur-md bg-black/20 border border-white/10 pointer-events-auto", theme.text)}>
                   <p className="text-xs font-bold text-white tracking-tight">{selected.title}</p>
                </div>
                <button 
                  onClick={() => setSelected(null)}
                  className={cn(
                    "p-3 rounded-full shadow-2xl transition-all active:scale-90 pointer-events-auto hover:rotate-90",
                    theme.accent, theme.accentContent || "text-white"
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="w-full bg-black flex items-center justify-center min-h-[40vh]">
                {selected.type === "video" ? (
                  <video 
                    src={selected.media_url} 
                    controls 
                    autoPlay 
                    className="w-full h-full max-h-[85vh] object-contain" 
                  />
                ) : (
                  <img 
                    src={selected.media_url} 
                    alt={selected.title} 
                    className="w-full h-auto max-h-[85vh] object-contain" 
                  />
                )}
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;