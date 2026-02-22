import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Image as ImageIcon, Maximize2, X } from "lucide-react";
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
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose";
}

const GallerySection = ({ gallery, theme = "orange" }: GallerySectionProps) => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  if (!gallery || gallery.length === 0) return null;

  const themeClasses = {
    orange: "[--gal-primary:#f97316] [--gal-bg:theme(colors.orange.50)]",
    blue: "[--gal-primary:#3b82f6] [--gal-bg:theme(colors.blue.50)]",
    purple: "[--gal-primary:#a855f7] [--gal-bg:theme(colors.purple.50)]",
    emerald: "[--gal-primary:#10b981] [--gal-bg:theme(colors.emerald.50)]",
    rose: "[--gal-primary:#f43f5e] [--gal-bg:theme(colors.rose.50)]",
  };

  return (
    <section className={cn("container py-16 px-4 md:px-6", themeClasses[theme])}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
           <ImageIcon className="h-4 w-4 text-[var(--gal-primary)]" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Visuals</p>
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
          Media <span className="text-[var(--gal-primary)]">Gallery</span>
        </h2>
      </motion.div>

      {/* Bento Mosaic Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
        {gallery.map((item, index) => {
          // Bento Logic: 1st and 6th items are "Big"
          const isLarge = index === 0 || index === 5;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(item)}
              className={cn(
                "group relative overflow-hidden rounded-[2rem] border-none shadow-lg bg-slate-100",
                isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              )}
            >
              {/* Image Layer */}
              <img
                src={item.media_url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                  {item.type === "video" ? (
                    <Play className="h-6 w-6 fill-white text-white" />
                  ) : (
                    <Maximize2 className="h-6 w-6 text-white" />
                  )}
                </div>
                <p className="text-white text-[10px] font-bold uppercase tracking-widest px-4 text-center">
                  {item.title}
                </p>
              </div>

              {/* Static Video Indicator */}
              {item.type === "video" && (
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-1.5 rounded-lg group-hover:opacity-0 transition-opacity">
                  <Play className="h-3 w-3 fill-white text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/90 border-none shadow-none backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
          <AnimatePresence>
            {selected && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center"
              >
                {/* Close Button Inside for UX */}
                <button 
                   onClick={() => setSelected(null)}
                   className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X className="h-5 w-5 text-white" />
                </button>

                <div className="w-full relative">
                  {selected.type === "video" ? (
                    <div className="aspect-video w-full bg-black flex items-center">
                      <video 
                        src={selected.media_url} 
                        controls 
                        autoPlay 
                        className="w-full h-full max-h-[70vh]"
                      />
                    </div>
                  ) : (
                    <img
                      src={selected.media_url}
                      alt={selected.title}
                      className="w-full h-auto max-h-[75vh] object-contain"
                    />
                  )}
                </div>

                <div className="w-full p-6 bg-white/5 border-t border-white/10 text-center">
                   <h3 className="text-white font-black italic uppercase tracking-tighter text-lg">
                     {selected.title}
                   </h3>
                   <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[var(--gal-primary)] text-[10px] font-black uppercase tracking-widest text-white">
                      {selected.type}
                   </div>
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