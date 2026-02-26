import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface ServicesSectionProps {
  services: Service[] | null;
  theme?: "emerald" | "slate";
}

const ServicesSection = ({ services, theme = "emerald" }: ServicesSectionProps) => {
  if (!services || services.length === 0) return null;

  const themeClasses = {
    emerald: "[--svc-accent:#2D6A4F]",
    slate: "[--svc-accent:#334155]",
  };

  return (
    <section className={cn("w-full py-10 bg-white", themeClasses[theme])}>
      <div className="container mx-auto px-4">
        {/* Section Header - Clean & Focused */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Our Services</h2>
          <div className="w-10 h-1 bg-[var(--svc-accent)] mt-1.5 rounded-full" />
        </div>

        {/* Card Grid - 2 columns for a balanced mobile view */}
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full border border-slate-100 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.08)] rounded-[1.5rem] overflow-hidden bg-white group">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Card Image - Larger area for visuals */}
                  <div className="aspect-[4/5] w-full overflow-hidden bg-slate-50">
                    <img 
                      src={service.image || "/placeholder.svg"} 
                      alt={service.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Body - Content only */}
                  <div className="p-4 flex flex-col justify-center text-center">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1.5 leading-normal">
                      {service.description}
                    </p>
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