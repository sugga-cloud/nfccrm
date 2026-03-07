import { motion } from "framer-motion";
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface Testimonial {
  id: number;
  reviewer_name: string;
  content: string;
  rating: number;
  is_visible: boolean;
  created_at: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[] | null;
  theme: any;
  ui: any;
}

const TestimonialsSection = ({ testimonials, theme, ui }: TestimonialsSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter only visible testimonials
  const visibleTestimonials = testimonials?.filter((t) => t.is_visible) || [];

  if (visibleTestimonials.length === 0) return null;

  // Simple layout toggle: Some themes use a slider, others use a grid
  const isSlider = ui.id === "modern" || ui.id === "glass";

  return (
    <section className={cn("relative w-full py-24 overflow-hidden transition-all duration-500", theme.bg, ui.spacing)}>
      
      {/* Background Decorations (Synced with Gallery style) */}
      {ui.id !== "classic" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn("absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full blur-[120px] opacity-[0.08]", theme.primary)} />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn("flex flex-col mb-16", ui.id === "minimal" ? "items-start text-left" : "items-center text-center")}
        >
          <div className="flex items-center gap-2 mb-3">
             <Sparkles className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>
                Testimonials
             </span>
          </div>
          <h2 className={cn("text-3xl md:text-5xl font-bold tracking-tighter leading-none uppercase italic", theme.text)}>
            What Clients <span className={theme.primary}>Say</span>
          </h2>
        </motion.div>

        {/* Testimonials List */}
        <div 
          ref={scrollRef}
          className={cn(
            "scrollbar-hide transition-all duration-700 gap-6",
            isSlider 
              ? "flex overflow-x-auto snap-x snap-mandatory pb-12 -mx-4 px-4" 
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {visibleTestimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-8 transition-all duration-500 border",
                theme.card, theme.border, 
                isSlider ? "flex-none w-[85vw] sm:w-[400px] snap-center" : "w-full",
                ui.id === "glass" ? "backdrop-blur-xl bg-white/5" : "bg-white/50",
                "hover:shadow-xl group"
              )}
            >
              {/* Decorative Quote Icon */}
              <Quote className={cn("absolute top-6 right-8 h-12 w-12 opacity-10 transition-transform group-hover:scale-110", theme.primary)} />

              <div className="relative z-10 space-y-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-4 w-4", 
                        i < item.rating ? "fill-current" : "opacity-20",
                        theme.primary
                      )} 
                    />
                  ))}
                </div>

                {/* Content */}
                <p className={cn("text-lg font-medium leading-relaxed italic", theme.text)}>
                  "{item.content}"
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center font-black text-xl", theme.accent, theme.accentContent)}>
                    {item.reviewer_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className={cn("font-bold uppercase tracking-tight", theme.text)}>
                      {item.reviewer_name}
                    </h4>
                    <p className={cn("text-[10px] font-black uppercase tracking-widest opacity-40", theme.text)}>
                      Verified Client
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;