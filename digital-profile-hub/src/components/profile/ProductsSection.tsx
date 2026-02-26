import { useRef } from "react";
import { motion } from "framer-motion";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
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
  theme?: "emerald" | "slate";
}

const ProductsSection = ({ 
  products, 
  currency = "₹", 
  theme = "emerald" 
}: ProductsSectionProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const themeClasses = {
    emerald: "[--prod-primary:#1B4332] [--prod-accent:#2D6A4F]",
    slate: "[--prod-primary:#0F172A] [--prod-accent:#334155]",
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

  return (
    <section className={cn("w-full py-12 bg-white overflow-hidden", themeClasses[theme])}>
      <div className="container mx-auto px-4 relative">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
               <Package className="h-4 w-4 text-[var(--prod-accent)]" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Shop</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Featured Products</h2>
          </div>

          {/* Navigators (Arrows) */}
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider (Shows 2 at a time on mobile) */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/products/${product.id}`)}
              // Width matches the gallery logic: 2 items per screen
              className="relative flex-none w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)] snap-start cursor-pointer group"
            >
              <Card className="h-full border border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden bg-white transition-all hover:shadow-md">
                <CardContent className="p-0 flex flex-col h-full">
                  
                  {/* Product Image */}
                  <div className="aspect-square w-full overflow-hidden bg-slate-50 relative">
                    <img 
                      src={product.image || "/placeholder.svg"} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Floating Price Badge */}
                    <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg">
                      <p className="text-[10px] font-bold">
                        {currency}{product.price}
                      </p>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 text-left">
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[9px] text-slate-500 line-clamp-1 mt-1">
                      {product.description}
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

export default ProductsSection;