import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
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

  if (!blogs || blogs.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <section className={cn("w-full py-16 transition-colors duration-500", theme.bg)}>
      <div className="container mx-auto px-4">
        
        {/* Section Header with Navigators */}
        <div className={cn(
          "flex justify-between items-end mb-10",
          ui.layout === "minimal" ? "flex-col items-start gap-4" : ""
        )}>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
               <BookOpen className={cn("h-4 w-4", theme.primary)} />
               <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-50", theme.text)}>
                 Insights
               </span>
            </div>
            <h2 className={cn("text-2xl font-black italic uppercase tracking-tighter", theme.text)}>Latest Blogs</h2>
            <div className={cn("w-12 h-1 mt-2 rounded-full", theme.accent)} />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => scroll("left")} 
              className={cn(
                "p-3 rounded-full border transition-all active:scale-90 shadow-sm", 
                theme.border, 
                theme.card, 
                "hover:brightness-110"
              )}
            >
              <ChevronLeft className={cn("h-5 w-5", theme.text)} />
            </button>
            <button 
              onClick={() => scroll("right")} 
              className={cn(
                "p-3 rounded-full border transition-all active:scale-90 shadow-sm", 
                theme.border, 
                theme.card, 
                "hover:brightness-110"
              )}
            >
              <ChevronRight className={cn("h-5 w-5", theme.text)} />
            </button>
          </div>
        </div>

        {/* Dynamic Slider */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide pb-8 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelected(blog)}
              className={cn(
                "relative flex-none snap-start cursor-pointer group",
                "w-[85%] md:w-[calc((100%-4rem)/3)]"
              )}
            >
              <Card className={cn(
                "h-full border shadow-md overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2",
                theme.card,
                theme.border,
                ui.layout === "minimal" ? "rounded-2xl" : "rounded-[2rem]"
              )}>
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="aspect-[16/11] w-full overflow-hidden relative">
                    <img 
                      src={blog.featured_image || "/placeholder.svg"} 
                      alt={blog.title} 
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest opacity-40", theme.text)}>
                      {formatDate(blog.created_at)}
                    </span>
                    <h3 className={cn("mt-2 text-lg font-bold line-clamp-2 leading-tight", theme.text)}>
                      {blog.title}
                    </h3>
                    <div className={cn(
                      "mt-auto pt-6 flex items-center text-[10px] font-black uppercase tracking-widest transition-all", 
                      theme.primary,
                      "group-hover:translate-x-1"
                    )}>
                      Read Full Article <ChevronRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-Screen Article View */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className={cn(
          "max-w-none w-screen h-screen m-0 rounded-none p-0 overflow-y-auto border-none flex flex-col transition-colors duration-500 z-[999]",
          theme.bg
        )}>
          {selected && (
            <div className="flex flex-col w-full min-h-full">
              {/* Top Navigation Bar */}
              <div className={cn(
                "sticky top-0 z-[1000] flex items-center justify-between backdrop-blur-xl px-6 py-4 border-b transition-all",
                theme.border,
                "bg-opacity-70",
                theme.bg
              )}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelected(null)} 
                    className={cn(
                        "p-2 rounded-full transition-all active:scale-90", 
                        theme.card, 
                        theme.border, 
                        "border"
                    )}
                  >
                    <ChevronLeft className={cn("h-5 w-5", theme.text)} />
                  </button>
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hidden sm:block", theme.text)}>
                    Back to Profile
                  </span>
                </div>
                <button 
                    onClick={() => setSelected(null)} 
                    className={cn(
                        "p-2 rounded-full transition-all active:scale-90", 
                        theme.accent, 
                        theme.accentContent // Fix for Pure Dark close button
                    )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Blog Content */}
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto px-6 py-12 w-full"
              >
                <header className="mb-10">
                  <span className={cn("text-xs font-black uppercase tracking-[0.3em]", theme.primary)}>
                    {formatDate(selected.created_at)}
                  </span>
                  <h1 className={cn("mt-4 text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter", theme.text)}>
                    {selected.title}
                  </h1>
                  <div className={cn("w-20 h-2 mt-8 rounded-full", theme.accent)} />
                </header>

                <div className="relative mb-12 group">
                    <img 
                      src={selected.featured_image || "/placeholder.svg"} 
                      alt={selected.title} 
                      className={cn(
                        "w-full aspect-video object-cover shadow-2xl transition-transform duration-700",
                        ui.layout === "minimal" ? "rounded-2xl" : "rounded-[3rem]"
                      )} 
                    />
                    <div className={cn("absolute -bottom-6 -right-6 h-32 w-32 rounded-full opacity-20 blur-3xl", theme.accent)} />
                </div>

                <div className="max-w-none">
                  <div className={cn(
                    "text-lg md:text-xl leading-relaxed whitespace-pre-wrap opacity-80 font-medium", 
                    theme.text
                  )}>
                    {selected.description || selected.excerpt} 
                  </div>
                </div>
                
                <div className="h-32 border-t mt-20 flex items-center justify-center opacity-20" style={{ borderColor: 'currentColor' }}>
                    <BookOpen className={cn("h-8 w-8", theme.text)} />
                </div>
              </motion.article>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BlogsSection;