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
  theme?: "emerald" | "slate";
}

const GallerySection = ({ gallery, theme = "emerald" }: GallerySectionProps) => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!gallery || gallery.length === 0) return null;

  const themeClasses = {
    emerald: "[--gal-primary:#2D6A4F]",
    slate: "[--gal-primary:#1E293B]",
  };

  return (
    <section className={cn("w-full py-10 bg-white overflow-hidden", themeClasses[theme])}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800">Media Gallery</h2>
          <div className="w-10 h-1 bg-[var(--gal-primary)] mt-1.5 rounded-full" />
        </div>

        {/* 2-at-a-time Horizontal Slider */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {gallery.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(item)}
              // Width set to calc((100% - gap)/2) to show exactly 2 items
              className="relative flex-none w-[calc((100%-1rem)/2)] aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm snap-start group"
            >
              <img
                src={item.media_url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />

              {/* Video Indicator */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <PlayCircle className="h-10 w-10 text-white/90 drop-shadow-lg" />
                </div>
              )}

              {/* Gradient Overlay for Title */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-6 text-left">
                <p className="text-white text-[10px] font-bold truncate uppercase tracking-wider">
                  {item.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox / Preview Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl p-0 bg-white border-none overflow-hidden rounded-[2rem] shadow-2xl">
          <AnimatePresence>
            {selected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button 
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="w-full">
                  {selected.type === "video" ? (
                    <div className="aspect-video w-full bg-black">
                      <video src={selected.media_url} controls autoPlay className="w-full h-full" />
                    </div>
                  ) : (
                    <img
                      src={selected.media_url}
                      alt={selected.title}
                      className="w-full h-auto max-h-[75vh] object-contain bg-slate-100"
                    />
                  )}
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-slate-900 font-bold text-lg">{selected.title}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-[0.2em]">
                    {selected.type}
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