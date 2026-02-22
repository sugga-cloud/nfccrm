import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { X } from "lucide-react"; // For a clean close button

interface BlogItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  created_at: string;
}

interface BlogsSectionProps {
  blogs: BlogItem[] | null;
}

const BlogsSection = ({ blogs }: BlogsSectionProps) => {
  const [selected, setSelected] = useState<BlogItem | null>(null);

  if (!blogs || blogs.length === 0) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <section className="container py-8">
      <h2 className="mb-8 text-center text-3xl font-black italic uppercase tracking-tighter text-slate-900">
        Latest <span className="text-orange-500">Insights</span>
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card 
            key={blog.id} 
            className="group cursor-pointer overflow-hidden rounded-[2rem] border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1" 
            onClick={() => setSelected(blog)}
          >
            <CardContent className="p-0 flex flex-col h-full">
              <div className="overflow-hidden">
                <img 
                  src={blog.featured_image || "/placeholder.svg"} 
                  alt={blog.title} 
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  {formatDate(blog.created_at)}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-tight text-slate-900 line-clamp-2 italic uppercase">
                  {blog.title}
                </h3>
                <p className="mt-3 text-sm font-medium text-slate-500 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="mt-auto pt-4">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-orange-500 transition-colors">
                    Read Story →
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FULL WIDTH / FULL HEIGHT DIALOG */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent 
          className="z-[100] max-w-none w-screen h-screen m-0 rounded-none p-0 overflow-y-auto border-none flex flex-col"
          hideCloseButton // Some Shadcn versions allow hiding the default small X
        >
          {selected && (
            <div className="flex flex-col w-full h-full bg-white">
              {/* Custom Header Navigation */}
              <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Article</p>
                  <p className="text-xs font-bold text-slate-400">{formatDate(selected.created_at)}</p>
                </div>
                <button 
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="h-6 w-6 text-slate-900" />
                </button>
              </div>

              {/* Main Content Area */}
              <article className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
                <header className="mb-10 text-center">
                  <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.9]">
                    {selected.title}
                  </h1>
                </header>

                <div className="mb-12">
                  <img 
                    src={selected.featured_image || "/placeholder.svg"} 
                    alt={selected.title} 
                    className="w-full aspect-video rounded-[3rem] object-cover shadow-2xl" 
                  />
                </div>

                {/* Content with proper wrapping and spacing */}
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg md:text-xl leading-relaxed text-slate-700 font-medium whitespace-pre-wrap break-words">
                    {selected.description || selected.excerpt} 
                  </p>
                </div>
                
                <div className="h-20" /> {/* Extra spacing at bottom */}
              </article>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BlogsSection;