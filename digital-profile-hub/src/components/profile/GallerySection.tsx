import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X } from "lucide-react";
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

  const isGridLayout = ui.layout === "grid";

  return (
    <section className={cn("w-full py-20 overflow-hidden transition-colors duration-500", theme.bg)}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "flex flex-col mb-10",
            ui.layout === "minimal" ? "items-start" : "items-center text-center"
          )}
        >
          <h2 className={cn("text-2xl font-black italic uppercase tracking-tighter", theme.text)}>
            Media Gallery
          </h2>
          <div className={cn("w-12 h-1.5 mt-2 rounded-full", theme.accent)} />
        </motion.div>

        {/* Dynamic Layout: Grid or Horizontal Slider */}
        <div 
          ref={scrollRef}
          className={cn(
            "scrollbar-hide pb-8 transition-all duration-500",
            isGridLayout 
              ? "grid grid-cols-2 md:grid-cols-3 gap-4" 
              : "flex overflow-x-auto gap-5 snap-x snap-mandatory"
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {gallery.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(item)}
              className={cn(
                "relative overflow-hidden border shadow-xl group transition-all duration-500 aspect-[4/5] outline-none",
                theme.card,
                theme.border,
                ui.layout === "minimal" ? "rounded-2xl" : "rounded-[2.5rem]",
                isGridLayout 
                  ? "w-full" 
                  : "flex-none w-[75vw] sm:w-[300px] snap-center"
              )}
            >
              <img
                src={item.media_url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />

              {/* Video Indicator - Themed Glassmorphism */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] group-hover:bg-black/40 transition-colors">
                  <div className={cn(
                    "p-4 rounded-full shadow-2xl transition-transform group-hover:scale-110",
                    theme.accent,
                    theme.accentContent || "text-white"
                  )}>
                    <PlayCircle className="h-8 w-8 fill-current" />
                  </div>
                </div>
              )}

              {/* Gradient Overlay for Title */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-12 text-left translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100">
                  {item.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox / Preview Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className={cn(
          "max-w-[95vw] sm:max-w-4xl p-0 border-none overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all bg-transparent",
          ui.layout === "minimal" ? "rounded-3xl" : "rounded-[3.5rem]"
        )}>
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn("relative overflow-hidden", theme.card, theme.border, "border-2")}
              >
                {/* Close Button - Themed Visibility */}
                <button 
                  onClick={() => setSelected(null)}
                  className={cn(
                    "absolute top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl shadow-2xl transition-all hover:rotate-90 active:scale-90",
                    theme.accent, 
                    theme.accentContent || "text-white"
                  )}
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="w-full bg-black/20">
                  {selected.type === "video" ? (
                    <div className="aspect-video w-full flex items-center justify-center">
                      <video 
                        src={selected.media_url} 
                        controls 
                        autoPlay 
                        className="w-full h-full max-h-[80vh]" 
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-2">
                      <img
                        src={selected.media_url}
                        alt={selected.title}
                        className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="p-8 text-center border-t border-white/5">
                  <h3 className={cn("font-black text-xl italic uppercase tracking-tight", theme.text)}>
                    {selected.title}
                  </h3>
                  <div className={cn("w-12 h-1 mx-auto mt-3 rounded-full opacity-50", theme.accent)} />
                  <p className={cn("text-[10px] font-black uppercase mt-4 tracking-[0.4em] opacity-30", theme.text)}>
                    Premium {selected.type} Experience
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;