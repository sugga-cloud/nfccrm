import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  theme?: "emerald" | "slate";
}

const BlogsSection = ({ blogs, theme = "emerald" }: BlogsSectionProps) => {
  const [selected, setSelected] = useState<BlogItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!blogs || blogs.length === 0) return null;

  const themeClasses = {
    emerald: "[--blog-accent:#2D6A4F] [--blog-bg:#F1F8F6]",
    slate: "[--blog-accent:#334155] [--blog-bg:#F8FAFC]",
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth / 1.5 
        : scrollLeft + clientWidth / 1.5;
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
    <section className={cn("w-full py-12 bg-white overflow-hidden", themeClasses[theme])}>
      <div className="container mx-auto px-4">
        
        {/* Section Header with Navigators */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
               <BookOpen className="h-4 w-4 text-[var(--blog-accent)]" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Insights</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Latest Blogs</h2>
            <div className="w-10 h-1 bg-[var(--blog-accent)] mt-1.5 rounded-full" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="p-2 rounded-full border border-slate-200 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <button onClick={() => scroll("right")} className="p-2 rounded-full border border-slate-200 hover:bg-slate-50">
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* 2-at-a-time Horizontal Slider */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(blog)}
              className="relative flex-none w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)] snap-start cursor-pointer group"
            >
              <Card className="h-full border border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden bg-white transition-all hover:shadow-md">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="aspect-video w-full overflow-hidden bg-slate-50">
                    <img 
                      src={blog.featured_image || "/placeholder.svg"} 
                      alt={blog.title} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[9px] font-bold text-[var(--blog-accent)] uppercase tracking-wider">
                      {formatDate(blog.created_at)}
                    </span>
                    <h3 className="mt-1 text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center text-[10px] font-bold text-slate-400 group-hover:text-[var(--blog-accent)] transition-colors">
                      Read More <ChevronRight className="ml-1 h-3 w-3" />
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
        <DialogContent className="max-w-none w-screen h-screen m-0 rounded-none p-0 overflow-y-auto border-none flex flex-col bg-white">
          {selected && (
            <div className="flex flex-col w-full h-full">
              {/* Top Navigation Bar */}
              <div className="sticky top-0 z-50 flex items-center justify-between bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-slate-100">
                    <ChevronLeft className="h-5 w-5 text-slate-900" />
                  </button>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Back to Profile</span>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-slate-100">
                  <X className="h-5 w-5 text-slate-900" />
                </button>
              </div>

              {/* Blog Content */}
              <article className="max-w-3xl mx-auto px-6 py-10 w-full">
                <header className="mb-8">
                  <span className="text-xs font-bold text-[var(--blog-accent)] uppercase tracking-[0.2em]">
                    {formatDate(selected.created_at)}
                  </span>
                  <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    {selected.title}
                  </h1>
                </header>

                <img 
                  src={selected.featured_image || "/placeholder.svg"} 
                  alt={selected.title} 
                  className="w-full aspect-video rounded-3xl object-cover mb-10 shadow-lg" 
                />

                <div className="prose prose-slate max-w-none">
                  <p className="text-base md:text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {selected.description || selected.excerpt} 
                  </p>
                </div>
                <div className="h-20" />
              </article>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BlogsSection;