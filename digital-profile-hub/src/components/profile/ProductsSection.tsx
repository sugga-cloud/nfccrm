import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Package, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Assuming you use sonner for notifications

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
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose";
}

const ProductsSection = ({ 
  products, 
  currency = "₹", 
  theme = "orange" 
}: ProductsSectionProps) => {
  const navigate = useNavigate();
  // State to track loading or success per button
  const [addingId, setAddingId] = useState<number | null>(null);

  if (!products || products.length === 0) return null;

  const themeClasses = {
    orange: "[--prod-primary:#f97316] [--prod-bg:theme(colors.orange.50)]",
    blue: "[--prod-primary:#3b82f6] [--prod-bg:theme(colors.blue.50)]",
    purple: "[--prod-primary:#a855f7] [--prod-bg:theme(colors.purple.50)]",
    emerald: "[--prod-primary:#10b981] [--prod-bg:theme(colors.emerald.50)]",
    rose: "[--prod-primary:#f43f5e] [--prod-bg:theme(colors.rose.50)]",
  };
const handleAddToCart = (product: Product, e: React.MouseEvent) => {
  e.stopPropagation();
  setAddingId(product.id);

  // 1. Get existing cart from storage
  const existingCart = JSON.parse(localStorage.getItem("nfc_cart") || "[]");
  
  // 2. Add new product
  const updatedCart = [...existingCart, { ...product, quantity: 1 }];
  
  // 3. Save back to storage
  localStorage.setItem("nfc_cart", JSON.stringify(updatedCart));

  setTimeout(() => {
      // Logic to sync with your Cart Context or Backend would go here
      toast.success(`${product.name} added to cart!`, {
        description: "Ready for checkout with online payment.", // 
        icon: <ShoppingCart className="h-4 w-4 text-orange-500" />,
      })
      setAddingId(null);
    });
};
  return (
    <section className={cn("w-full py-24 px-4 md:px-6 relative overflow-hidden", themeClasses[theme])}>
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[var(--prod-primary)] opacity-[0.03] blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto flex flex-col items-center mb-16"
      >
        <div className="flex items-center gap-2 mb-3">
           <Package className="h-4 w-4 text-[var(--prod-primary)]" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Digital Store</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 text-center">
          Featured <span className="text-[var(--prod-primary)] text-stroke">Products</span>
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <Card className="flex flex-col h-full border-none shadow-2xl shadow-slate-200/60 rounded-[3rem] overflow-hidden bg-white z-10 relative transition-all duration-500 group-hover:-translate-y-4">
              <CardContent className="p-0 flex-1 relative">
                <div 
                   className="relative h-72 w-full overflow-hidden bg-slate-50 cursor-pointer"
                   onClick={() => navigate(`/products/${product.id}`)}
                >
                  <img 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  <div className="absolute top-6 left-6 bg-slate-900 text-white px-5 py-2 rounded-2xl shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-transform">
                    <p className="text-xl font-black italic tracking-tighter">
                      <span className="text-[var(--prod-primary)] mr-1">{currency}</span>
                      {product.price}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white p-4 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Eye className="h-6 w-6 text-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.9] mb-3">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-8 pt-0 gap-3">
                <Button 
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="flex-1 h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest transition-all gap-2 group/btn shadow-xl shadow-slate-200"
                >
                  Details
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform text-[var(--prod-primary)]" />
                </Button>
                
                {/* Updated Add to Cart Button 
                <Button 
                  variant="outline" 
                  disabled={addingId === product.id}
                  className={cn(
                    "h-14 w-14 rounded-2xl border-slate-100 transition-all p-0 flex items-center justify-center",
                    addingId === product.id ? "bg-emerald-50 border-emerald-200" : "hover:border-[var(--prod-primary)] hover:bg-[var(--prod-bg)]"
                  )}
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  {addingId === product.id ? (
                    <Check className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 text-slate-400 group-hover:text-[var(--prod-primary)]" />
                  )}
                </Button> */}
              </CardFooter>
            </Card>

            <div className="absolute inset-0 translate-x-4 translate-y-4 bg-[var(--prod-primary)] opacity-10 rounded-[3rem] -z-10 transition-transform duration-500 group-hover:translate-x-8 group-hover:translate-y-8" />
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-slate-100 rounded-[3rem] -z-10" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;