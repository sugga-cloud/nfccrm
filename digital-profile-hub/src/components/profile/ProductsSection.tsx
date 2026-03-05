import { useRef } from "react";
import { motion } from "framer-motion";
import { Package, ChevronLeft, ChevronRight, ShoppingCart, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
}

interface ProductsSectionProps {
  products: Product[] | null;
  currency?: string;
  theme: any; 
  ui: any;    
}

const ProductsSection = ({ 
  products, 
  currency = "₹", 
  theme, 
  ui 
}: ProductsSectionProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  // Layout-specific styling mapping
  const layouts = {
    classic: { card: "rounded-none border-x-0", badge: "rounded-none", nav: "rounded-none", grid: "grid-cols-2 md:grid-cols-4 gap-0" },
    modern: { card: "rounded-[2.5rem]", badge: "rounded-full", nav: "rounded-full", grid: "grid-cols-2 lg:grid-cols-4 gap-6" },
    glass: { card: "rounded-3xl backdrop-blur-md bg-white/5 border-white/20", badge: "rounded-xl backdrop-blur-xl", nav: "rounded-xl", grid: "grid-cols-2 lg:grid-cols-4 gap-6" },
    minimal: { card: "rounded-2xl border-none shadow-none bg-transparent p-0", badge: "rounded-lg", nav: "rounded-lg", grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
    bento: { card: "rounded-[2rem]", badge: "rounded-2xl", nav: "rounded-2xl", grid: "grid-cols-2 lg:grid-cols-4 gap-4" },
  };

  const style = layouts[ui.id as keyof typeof layouts] || layouts.modern;
  const isGridLayout = ui.layout === "grid";

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className={cn("w-full py-12 transition-all duration-500", theme.bg, ui.spacing)}>
      <div className="container mx-auto px-4 relative">
        
        {/* Section Header */}
        <div className={cn(
          "flex flex-col md:flex-row md:items-end mb-10",
          ui.id === "minimal" ? "items-start" : "items-center md:justify-between text-center md:text-left"
        )}>
          <div className="flex flex-col">
            <div className={cn("flex items-center gap-2 mb-2", ui.id !== "minimal" && "justify-center md:justify-start")}>
               <Package className={cn("h-4 w-4", theme.primary)} />
               <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-50", theme.text)}>
                  Collection
               </span>
            </div>
            <h2 className={cn("text-2xl font-bold tracking-tight", theme.text)}>
              Featured Products
            </h2>
            {ui.id !== "minimal" && <div className={cn("w-12 h-1 mt-3 rounded-full", theme.accent, "mx-auto md:mx-0")} />}
          </div>

          {/* Navigators */}
          {!isGridLayout && (
            <div className="hidden md:flex gap-2 mt-6 md:mt-0">
              <button onClick={() => scroll("left")} className={cn("p-2 border transition-all active:scale-90", theme.card, theme.border, theme.text, style.nav)}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scroll("right")} className={cn("p-2 border transition-all active:scale-90", theme.card, theme.border, theme.text, style.nav)}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Wrapper */}
        <div 
          ref={scrollRef}
          className={cn(
            "scrollbar-hide pb-6 transition-all duration-500",
            isGridLayout ? style.grid : "flex overflow-x-auto gap-5 snap-x snap-mandatory"
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/products/${product.id}`)}
              className={cn(
                "group cursor-pointer",
                isGridLayout ? "w-full" : "flex-none w-[75vw] sm:w-[260px] snap-center",
                ui.id === "bento" && isGridLayout && (index % 5 === 0 ? "md:col-span-2" : "")
              )}
            >
              <Card className={cn(
                "h-full border transition-all duration-500 overflow-hidden",
                theme.card, theme.border, style.card,
                ui.id !== "minimal" && "hover:shadow-2xl group-hover:-translate-y-2 shadow-lg"
              )}>
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="aspect-square w-full overflow-hidden relative bg-black/5">
                    <img 
                      src={product.image || "/placeholder.svg"} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Action */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className={cn(
                          "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all p-3 shadow-xl",
                          theme.accent, theme.accentContent || "text-white", style.badge
                        )}>
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Price Tag */}
                    <div className={cn(
                      "absolute top-3 right-3 px-3 py-1 shadow-lg border border-white/10",
                      theme.accent, theme.accentContent || "text-white", style.badge,
                      ui.id === "glass" && "bg-white/20 backdrop-blur-xl"
                    )}>
                      <p className="text-[10px] font-black">{currency}{product.price}</p>
                    </div>
                  </div>

                  <div className={cn("p-5 flex flex-col flex-grow", ui.id === "minimal" && "px-0")}>
                    <h3 className={cn("text-sm font-bold tracking-tight line-clamp-1", theme.text)}>
                      {product.name}
                    </h3>
                    <p className={cn("text-[11px] mt-2 opacity-50 line-clamp-2 leading-relaxed", theme.text)}>
                      {product.description}
                    </p>
                    <div className={cn("mt-auto pt-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity", theme.primary)}>
                      View Product <ArrowUpRight className="h-3 w-3" />
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

export default ProductsSection;