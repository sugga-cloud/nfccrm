import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Layers, ArrowUpRight } from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface ServicesSectionProps {
  services: Service[] | null;
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose";
}

const ServicesSection = ({ services, theme = "orange" }: ServicesSectionProps) => {
  if (!services || services.length === 0) return null;

  const themeClasses = {
    orange: "[--svc-primary:#f97316] [--svc-bg:theme(colors.orange.50)]",
    blue: "[--svc-primary:#3b82f6] [--svc-bg:theme(colors.blue.50)]",
    purple: "[--svc-primary:#a855f7] [--svc-bg:theme(colors.purple.50)]",
    emerald: "[--svc-primary:#10b981] [--svc-bg:theme(colors.emerald.50)]",
    rose: "[--svc-primary:#f43f5e] [--svc-bg:theme(colors.rose.50)]",
  };

  return (
    <section className={cn("w-full py-12 px-4 md:px-6", themeClasses[theme])}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto flex flex-col items-center mb-12"
      >
        <div className="flex items-center gap-2 mb-2">
           <Layers className="h-4 w-4 text-[var(--svc-primary)]" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Expertise</p>
        </div>
        <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 text-center">
          Featured <span className="text-[var(--svc-primary)]">Services</span>
        </h2>
      </motion.div>

      {/* Enhanced Bento Grid - Full Width Style */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[280px] md:auto-rows-[320px]">
        {services.map((service, index) => {
          // Dynamic Span Logic for Full Width feel:
          // Pattern: 4 cols (Wide), 2 cols (Small), 3 cols (Medium), 3 cols (Medium)
          const spanClass = [
            "md:col-span-4", // Wide
            "md:col-span-2", // Small
            "md:col-span-3", // Medium
            "md:col-span-3", // Medium
          ][index % 4];

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn("relative group h-full", spanClass)}
            >
              <Card className="h-full w-full border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white z-10 relative transition-transform duration-500 group-hover:-translate-y-2">
                <CardContent className="p-0 h-full flex flex-col">
                  
                  {/* Image Background Container */}
                  <div className="relative h-1/2 w-full overflow-hidden">
                    <img 
                      src={service.image || "/placeholder.svg"} 
                      alt={service.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                    
                    {/* Floating Icon Link */}
                    <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="h-5 w-5 text-[var(--svc-primary)]" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-8 pt-2 flex flex-col justify-start">
                    <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm md:text-base line-clamp-2 md:line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* STACK EFFECT: Layered shadows/shapes behind the card */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[var(--svc-primary)]/10 rounded-[2.5rem] -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-all duration-500" />
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-slate-100 rounded-[2.5rem] -z-10" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;