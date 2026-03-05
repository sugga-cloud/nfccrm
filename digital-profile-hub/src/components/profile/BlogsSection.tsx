import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BlogItem {
  id: number;
  title: string;
  excerpt: string;
  description?: string;
  featured_image: string;
  created_at: string;
}

interface BlogsSectionProps {
  blogs: BlogItem[] | null;
  theme: any; 
  ui: any;    
}

const BlogsSection = ({ blogs, theme, ui }: BlogsSectionProps) => {
  const [selected, setSelected] = useState<BlogItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- LAYOUT MAPPING ---
  const layoutConfigs: Record<string, any> = {
    "1": { card: "rounded-none border-2", shadow: "shadow-none", padding: "p-4", header: "items-center text-center", img: "rounded-none" },
    "2": { card: "rounded-[2.5rem] border", shadow: "shadow-2xl", padding: "p-6", header: "items-center text-center", img: "rounded-2xl" },
    "3": { card: "rounded-[2rem] backdrop-blur-xl bg-white/5 border-white/20", shadow: "shadow-none", padding: "p-6", header: "items-center text-center", img: "rounded-xl" },
    "4": { card: "rounded-2xl border-none bg-secondary/5", shadow: "shadow-none", padding: "p-4", header: "items-start text-left", img: "rounded-lg" },
    "5": { card: "rounded-[2rem] border-2", shadow: "shadow-none", padding: "p-5", header: "items-center text-center", img: "rounded-[1.5rem]" },
  };

  const style = layoutConfigs[ui.id] || layoutConfigs["2"];

  if (!blogs || blogs.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className={cn("relative w-full py-20 overflow-hidden transition-all duration-500", theme.bg, ui.spacing)}>
      
      {/* 1. Animated Background Blobs (Dynamic for non-classic) */}
      {ui.id !== "1" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ x: [100, 0, 100], y: [0, 100, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className={cn("absolute top-0 right-0 w-[50%] h-[50%] rounded-full blur-[140px] opacity-[0.15]", theme.primary)} 
          />
          <motion.div 
            animate={{ x: [0, 100, 0], y: [100, 0, 100] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={cn("absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full blur-[120px] opacity-[0.1]", theme.accent)} 
          />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-6">
        
        {/* Header - Adapts to UI ID */}
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6", 
          ui.id === "4" ? "items-start" : "items-center"
        )}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={cn("flex flex-col", style.header)}
          >
            <div className="flex items-center gap-2 mb-2">
               <Sparkles className={cn("h-4 w-4", theme.primary)} />
               <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>Journal</span>
            </div>
            <h2 className={cn("text-3xl md:text-4xl font-bold tracking-tighter", theme.text)}>Latest Insights</h2>
            {ui.id !== "4" && <div className={cn("w-12 h-1 mt-4 rounded-full", theme.accent, ui.id === "1" && "rounded-none")} />}
          </motion.div>

          <div className="flex gap-3">
            <button 
              onClick={() => scroll("left")} 
              className={cn("p-3 rounded-full border transition-all hover:scale-110 active:scale-90", theme.border, theme.card, theme.text)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll("right")} 
              className={cn("p-3 rounded-full border transition-all hover:scale-110 active:scale-90", theme.border, theme.card, theme.text)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Slider */}
        <div 
          ref={scrollRef} 
          className={cn(
            "flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10",
            ui.id === "4" ? "px-2" : "px-0"
          )}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelected(blog)}
              className={cn("flex-none snap-center cursor-pointer group w-[85%] md:w-[400px]")}
            >
              <Card className={cn("h-full border overflow-hidden transition-all duration-700", 
                theme.card, theme.border, style.card, style.shadow,
                "group-hover:translate-y-[-8px]"
              )}>
                <CardContent className={cn("p-0 flex flex-col h-full", style.padding)}>
                  <div className={cn("aspect-[16/10] w-full overflow-hidden relative mb-5", style.img)}>
                    <img 
                      src={blog.featured_image || "/placeholder.svg"} 
                      alt={blog.title} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest opacity-40", theme.text)}>
                      {formatDate(blog.created_at)}
                    </span>
                    <div className={cn("h-px flex-grow opacity-10", theme.text)} />
                  </div>

                  <h3 className={cn("text-xl font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors", theme.text)}>
                    {blog.title}
                  </h3>
                  
                  <p className={cn("mt-3 text-sm opacity-50 line-clamp-2 leading-relaxed", theme.text)}>
                    {blog.excerpt}
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", theme.primary)}>Read Article</span>
                    <BookOpen className={cn("h-4 w-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all", theme.primary)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-Screen Article View */}
      <AnimatePresence>
        {selected && (
          <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
            <DialogContent className={cn("max-w-none w-screen h-screen m-0 rounded-none border-none p-0 overflow-y-auto z-[999] animate-in fade-in zoom-in duration-300", theme.bg)}>
              <div className="flex flex-col w-full min-h-full">
                {/* Fixed Top Nav */}
                <div className={cn("sticky top-0 z-[1000] flex items-center justify-between px-6 py-4 backdrop-blur-md border-b", 
                  theme.border, 
                  theme.name === "Pure Dark" ? "bg-black/80" : "bg-white/80"
                )}>
                  <div className="flex items-center gap-2">
                    <BookOpen className={cn("h-4 w-4", theme.primary)} />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest opacity-40", theme.text)}>Reading Mode</span>
                  </div>
                  <button 
                    onClick={() => setSelected(null)} 
                    className={cn("p-2 rounded-full border transition-transform hover:rotate-90", theme.border)}
                  >
                    <X className={cn("h-5 w-5", theme.text)} />
                  </button>
                </div>

                <motion.article 
                  initial={{ opacity: 0, y: 40 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="max-w-3xl mx-auto px-6 py-16 w-full"
                >
                  <header className="mb-12 text-center">
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className={cn("text-xs font-black uppercase tracking-[0.4em]", theme.primary)}
                    >
                      Published {formatDate(selected.created_at)}
                    </motion.span>
                    <h1 className={cn("mt-6 text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1]", theme.text)}>
                      {selected.title}
                    </h1>
                  </header>

                  <div className="relative mb-12 group">
                     <div className={cn("absolute -inset-4 blur-2xl opacity-20 rounded-full transition-opacity group-hover:opacity-30", theme.primary)} />
                     <img 
                        src={selected.featured_image} 
                        alt={selected.title} 
                        className={cn("relative w-full aspect-video object-cover shadow-2xl", 
                          ui.id === '3' ? 'rounded-2xl' : 'rounded-[2.5rem]'
                        )} 
                      />
                  </div>

                  <div className={cn("prose prose-lg max-w-none whitespace-pre-wrap opacity-80 leading-relaxed md:text-xl", theme.text)}>
                    {selected.description || selected.excerpt}
                  </div>
                </motion.article>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogsSection;