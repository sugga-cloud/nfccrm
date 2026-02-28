import { useRef } from "react";
import { motion } from "framer-motion";
import { Package, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
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

  const isGridLayout = ui.layout === "grid";

  return (
    <section className={cn("w-full py-20 transition-colors duration-500", theme.bg)}>
      <div className="container mx-auto px-4 relative">
        
        {/* Section Header */}
        <div className={cn(
          "flex items-end mb-10",
          isGridLayout ? "justify-center text-center" : "justify-between"
        )}>
          <div className="flex flex-col">
            <div className={cn("flex items-center gap-2 mb-2", isGridLayout && "justify-center")}>
               <Package className={cn("h-4 w-4", theme.primary)} />
               <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>
                 Collection
               </span>
            </div>
            <h2 className={cn("text-3xl font-black italic uppercase tracking-tighter", theme.text)}>
              Featured Products
            </h2>
            <div className={cn("w-12 h-1.5 mt-3 rounded-full", theme.accent, isGridLayout && "mx-auto")} />
          </div>

          {/* Navigators - Hidden if in Grid mode */}
          {!isGridLayout && (
            <div className="hidden md:flex gap-3 mb-1">
              <button 
                onClick={() => scroll("left")}
                className={cn(
                  "p-3 rounded-full border-2 transition-all active:scale-90 hover:shadow-lg",
                  theme.card, theme.border, theme.text
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className={cn(
                  "p-3 rounded-full border-2 transition-all active:scale-90 hover:shadow-lg",
                  theme.card, theme.border, theme.text
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Layout Wrapper */}
        <div 
          ref={scrollRef}
          className={cn(
            "scrollbar-hide pb-10 transition-all duration-500",
            isGridLayout 
              ? "grid grid-cols-2 lg:grid-cols-4 gap-6" 
              : "flex overflow-x-auto gap-6 snap-x snap-mandatory"
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/products/${product.id}`)}
              className={cn(
                "relative cursor-pointer group transition-all duration-500",
                isGridLayout 
                  ? "w-full" 
                  : "flex-none w-[70vw] sm:w-[280px] snap-center"
              )}
            >
              <Card className={cn(
                "h-full border shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden",
                theme.card,
                theme.border,
                ui.layout === "minimal" ? "rounded-3xl" : "rounded-[3rem]"
              )}>
                <CardContent className="p-0 flex flex-col h-full">
                  
                  {/* Product Image */}
                  <div className="aspect-square w-full overflow-hidden relative">
                    <img 
                      src={product.image || "/placeholder.svg"} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                        <div className={cn(
                            "opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 p-3 rounded-full shadow-2xl",
                            theme.accent,
                            theme.accentContent || "text-white"
                        )}>
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Floating Price Badge - Corrected for High Contrast Themes */}
                    <div className={cn(
                      "absolute top-4 right-4 backdrop-blur-xl px-4 py-1.5 rounded-full shadow-2xl transition-all border border-white/10",
                      theme.accent, 
                      theme.accentContent || "text-white"
                    )}>
                      <p className="text-xs font-black tracking-tight">
                        {currency}{product.price}
                      </p>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 text-left flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className={cn("text-base font-black italic uppercase tracking-tighter line-clamp-1", theme.text)}>
                        {product.name}
                        </h3>
                        <p className={cn("text-[10px] font-bold line-clamp-2 mt-2 opacity-40 leading-relaxed", theme.text)}>
                        {product.description}
                        </p>
                    </div>
                    <div className={cn("w-8 h-1 mt-4 rounded-full opacity-20", theme.accent)} />
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