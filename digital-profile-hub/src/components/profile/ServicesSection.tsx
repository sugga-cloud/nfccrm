import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface ServicesSectionProps {
  services: Service[] | null;
  theme: any; 
  ui: any;    
}

const ServicesSection = ({ services, theme, ui }: ServicesSectionProps) => {
  if (!services || services.length === 0) return null;

  // Layout Logic: Modern (Grid), Minimal (Stack), or Glass (Carousel-style)
  const isStack = ui.layout === "minimal";
  const gridConfig = isStack ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3";

  return (
    <section className={cn("w-full py-20 transition-colors duration-500", theme.bg)}>
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "flex flex-col mb-12",
            isStack ? "items-start" : "items-center text-center"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
             <Briefcase className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>
               Our Expertise
             </span>
          </div>
          <h2 className={cn("text-3xl font-black italic uppercase tracking-tighter", theme.text)}>
            Professional Services
          </h2>
          <div className={cn("w-12 h-1.5 mt-3 rounded-full transition-all", theme.accent)} />
        </motion.div>

        {/* Card Grid */}
        <div className={cn("grid gap-6 max-w-5xl mx-auto", gridConfig)}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "h-full border-2 transition-all duration-500 group overflow-hidden shadow-xl hover:shadow-2xl",
                theme.card,
                theme.border,
                ui.layout === "minimal" ? "rounded-3xl" : "rounded-[2.5rem]"
              )}>
                <CardContent className="p-0 flex flex-col h-full relative">
                  
                  {/* Service Image with Gradient Overlay */}
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img 
                      src={service.image || "/placeholder.svg"} 
                      alt={service.title} 
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Themed Gradient Overlay for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>

                  {/* Floating Identity Icon (Top Left) */}
                  <div className={cn(
                    "absolute top-4 left-4 p-2 rounded-xl backdrop-blur-xl border border-white/10 shadow-2xl",
                    theme.card, "bg-opacity-80"
                  )}>
                    <Briefcase className={cn("h-4 w-4", theme.primary)} />
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className={cn(
                        "text-lg font-black italic uppercase tracking-tight leading-tight",
                        theme.text
                      )}>
                        {service.title}
                      </h3>
                      <p className={cn(
                        "text-[11px] font-medium mt-3 leading-relaxed opacity-40 line-clamp-3",
                        theme.text
                      )}>
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Action Hint */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                        <div className={cn("w-8 h-1 rounded-full opacity-20", theme.accent)} />
                        <motion.div 
                          whileHover={{ x: 5 }}
                          className={cn("flex items-center gap-1 text-[9px] font-black uppercase tracking-widest cursor-pointer", theme.primary)}
                        >
                          Enquire <ChevronRight className="h-3 w-3" />
                        </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;