import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ChevronRight, ArrowUpRight } from "lucide-react";
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

  // CLASSIC: Strict vertical list, no shadows, sharp edges, ordered
  const classicLayout = () => (
    <section className={cn("w-full py-20 transition-all duration-500", theme.bg)}>
      <div className="container mx-auto px-6">
        <div className="mb-16 border-b-2" style={{ borderColor: theme.border }}>
          <h2 className={cn("text-4xl font-bold tracking-tighter uppercase", theme.text)}>Services</h2>
          <p className={cn("text-xs mt-2 opacity-60 uppercase tracking-widest", theme.primary)}>Expertise</p>
        </div>
        
        <div className="space-y-0">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={cn("border-b flex gap-6 py-8", theme.border, index === services.length - 1 && "border-b-0")}
            >
              <div className="w-32 h-32 flex-shrink-0 overflow-hidden border-2" style={{ borderColor: theme.border }}>
                <img src={service.image || "/placeholder.svg"} alt={service.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className={cn("text-xl font-bold uppercase tracking-wide", theme.text)}>{service.title}</h3>
                <p className={cn("text-sm mt-3 leading-relaxed opacity-70", theme.text)}>{service.description}</p>
                <div className="mt-4 flex items-center gap-1 cursor-pointer">
                  <span className={cn("text-xs font-bold uppercase tracking-widest", theme.primary)}>Read More</span>
                  <ChevronRight className="h-3 w-3" style={{ color: theme.primary.split('-')[1] }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // MODERN: 3-column grid with rounded cards, subtle shadows, hover lift
  const modernLayout = () => (
    <section className={cn("w-full py-20 transition-all duration-500", theme.bg)}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className={cn("text-4xl font-bold", theme.text)}>Services</h2>
          <div className={cn("w-12 h-1 mx-auto mt-3 rounded-full", theme.accent)} />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className={cn("h-full border-0 rounded-[2.5rem] overflow-hidden shadow-lg transition-all hover:shadow-2xl", theme.card)}>
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden relative">
                    <img src={service.image || "/placeholder.svg"} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className={cn("text-lg font-bold", theme.text)}>{service.title}</h3>
                    <p className={cn("text-sm mt-3 opacity-60", theme.text)}>{service.description}</p>
                    <div className={cn("mt-5 inline-block px-4 py-2 rounded-full text-xs font-bold cursor-pointer", theme.accent, theme.accentContent)}>
                      Learn More →
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

  // GLASS: Float cards with glassmorphism, translucent backgrounds, centered spacing
  const glassLayout = () => (
    <section className={cn("w-full py-24 transition-all duration-500", theme.bg)}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
          <h2 className={cn("text-5xl font-bold", theme.text)}>Services</h2>
          <p className={cn("text-xs mt-4 opacity-40 uppercase tracking-[0.2em]", theme.text)}>Our Expertise & Solutions</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="h-full"
            >
              <div className={cn("h-full rounded-[2rem] backdrop-blur-xl border border-white/20 bg-white/5 overflow-hidden shadow-2xl transition-all")}>
                <div className="aspect-video overflow-hidden">
                  <img src={service.image || "/placeholder.svg"} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                </div>
                <div className="p-8">
                  <h3 className={cn("text-xl font-bold", theme.text)}>{service.title}</h3>
                  <p className={cn("text-sm mt-4 leading-relaxed opacity-60", theme.text)}>{service.description}</p>
                  <div className={cn("mt-6 text-sm font-bold uppercase tracking-wider cursor-pointer", theme.primary)}>
                    Explore More ↗
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // MINIMAL: Sparse single column, wide aspect ratio, subtle dividers
  const minimalLayout = () => (
    <section className={cn("w-full py-24 transition-all duration-500", theme.bg)}>
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="mb-20">
          <h2 className={cn("text-4xl font-bold tracking-tight", theme.text)}>Services</h2>
        </div>
        
        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className={cn("border-t pt-12", theme.border, index === 0 && "border-t-0 pt-0")}>
                <div className="aspect-[8/3] overflow-hidden rounded-xl mb-8 bg-secondary/5">
                  <img src={service.image || "/placeholder.svg"} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <h3 className={cn("text-2xl font-bold mb-4", theme.text)}>{service.title}</h3>
                <p className={cn("text-base leading-relaxed opacity-70 mb-6", theme.text)}>{service.description}</p>
                <div className={cn("text-xs font-bold uppercase tracking-widest cursor-pointer", theme.primary)}>
                  Learn More
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // BENTO: Play layout with varying sizes, vibrant cards, bouncy animations
  const bentoLayout = () => (
    <section className={cn("w-full py-20 transition-all duration-500", theme.bg)}>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className={cn("text-4xl font-bold", theme.text)}>Our Services</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[300px]">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className={cn("lg:col-span-2 md:row-span-2", index === 0 || index === services.length - 1 ? "lg:col-span-2" : "lg:col-span-1")}
            >
              <Card className={cn("h-full border-0 overflow-hidden shadow-xl transition-all cursor-pointer", theme.card)}>
                <CardContent className="p-0 relative h-full">
                  <img src={service.image || "/placeholder.svg"} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <h3 className={cn("text-lg font-bold text-white")}>{service.title}</h3>
                    <p className="text-xs text-white/70 mt-2 line-clamp-2">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Render based on UI
  switch (ui.id) {
    case "classic":
      return classicLayout();
    case "modern":
      return modernLayout();
    case "glass":
      return glassLayout();
    case "minimal":
      return minimalLayout();
    case "bento":
      return bentoLayout();
    default:
      return modernLayout();
  }

};

export default ServicesSection;