import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck, Check } from "lucide-react"; // Added Check
import MainLayout from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Ensure toast is imported

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false); // Track loading state

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch(e => console.log(e.response?.data?.message));
  }, [id]);

  // --- ADD TO CART LOGIC ---
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);

    // 1. Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("nfc_cart") || "[]");
    
    // 2. Check if item already exists
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      // Structure the object to match what your Checkout Page expects
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    // 3. Save to storage & Trigger the floating button update
    localStorage.setItem("nfc_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    // 4. Feedback UI
    setTimeout(() => {
      toast.success(`${product.name} added to your bag!`, {
        description: "View your cart to complete the order enquiry.",
      });
      setIsAdding(false);
    }, 500);
  };

  if (!product) return null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
            <img 
              src={product.image || "/placeholder.png"} 
              className="w-full h-full object-cover" 
              alt={product.name}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="space-y-6">
            <Badge className="bg-slate-100 text-slate-600 border-none font-bold uppercase tracking-widest text-[9px]">
              {product.category || 'NFC Hardware'}
            </Badge>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.9]">
              {product.name}
            </h1>
            <p className="text-4xl font-black text-orange-500 tracking-tighter italic">
              ₹{product.price}
            </p>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md">
              {product.description || "High-quality matte finish NFC business card with deep engraving options."}
            </p>

            <div className="flex flex-col gap-4 py-8 border-y border-slate-100">
              <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                <Truck className="h-5 w-5 text-orange-500" /> Free Pan-India Shipping
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                <RotateCcw className="h-5 w-5 text-orange-500" /> 7-Day Replacement Policy
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {/* Updated Button with Logic */}
              <Button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-2xl transition-all ${
                  isAdding ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-black'
                } text-white`}
              >
                {isAdding ? (
                  <Check className="h-4 w-4 animate-in zoom-in" />
                ) : (
                  <ShoppingBag className="h-4 w-4" />
                )}
                {isAdding ? "Added!" : "Add to Cart"}
              </Button>
              
              <Button variant="outline" className="h-16 w-16 rounded-2xl border-slate-200">
                <ShieldCheck className="h-6 w-6 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;