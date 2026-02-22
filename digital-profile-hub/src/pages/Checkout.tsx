import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, ShoppingBag, Trash2, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/api/api";

const CheckoutPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("nfc_cart") || "[]");
    setCart(savedCart);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  const handleRemove = (id: number) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("nfc_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };
const onSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  
  const formData = new FormData(e.currentTarget);
  
  // 1. Format the Cart into a readable "Message" for the Enquiry
  // This satisfies the "Submit to Dashboard" requirement 
  const orderSummary = cart.map(item => 
    `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`
  ).join("\n");

  const fullMessage = `ORDER DETAILS:\n${orderSummary}\n\nCUSTOMER NOTE:\n${formData.get("message")}\n\nTOTAL: ₹${subtotal}`;
  const id = localStorage.getItem('profileId');
  // 2. Prepare payload for EnquiryController::store
  const enquiryPayload = {
    profile_id: id, // Ensure you pass the current profile's ID [cite: 19]
    name: formData.get("name"), // [cite: 73]
    email: formData.get("email"), // [cite: 75]
    phone: formData.get("phone"), // 
    message: fullMessage, // Combined order details [cite: 76]
  };

  try {
    // 3. Send to your existing endpoint
    await api.post("/enquire", enquiryPayload);
    
    toast.success("Order Enquiry Sent!");
    
    // 4. Clear cart and redirect
    localStorage.removeItem("nfc_cart");
    window.dispatchEvent(new Event("cartUpdated"));
    
    // Optional: Add a success popup as per requirements [cite: 104]
    // navigate(`/profile/${data.username}`); 
  } catch (err) {
    toast.error("Failed to send enquiry. Please try again.");
  } finally {
    setLoading(false);
  }
};
  if (cart.length === 0) return (
     <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <ShoppingBag className="h-16 w-16 text-slate-200 mb-4" />
        <h2 className="text-2xl font-black italic uppercase text-slate-900">Cart is Empty</h2>
        <Button className="mt-4 rounded-2xl" onClick={() => window.history.back()}>Go Back</Button>
     </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-10">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Checkout</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Contact Form [cite: 71] */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Details</h3>
          </div>
          <form id="orderForm" onSubmit={onSubmitOrder} className="space-y-4">
            <Input name="name" placeholder="Full Name" required className="h-12 rounded-xl" />
            <Input name="phone" type="tel" placeholder="Phone Number" required className="h-12 rounded-xl" />
            <Input name="email" type="email" placeholder="Email Address" required className="h-12 rounded-xl" />
            <Textarea name="message" placeholder="Special Instructions or Address..." className="rounded-xl min-h-[120px]" />
          </form>
        </section>

        {/* Right: Summary */}
        <section className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
          <h3 className="text-xl font-black italic uppercase mb-6">Order Summary</h3>
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">QTY: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black italic">₹{item.price * item.quantity}</span>
                  <button onClick={() => handleRemove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex justify-between text-2xl font-black italic uppercase">
              <span>Total</span>
              <span className="text-orange-500">₹{subtotal.toLocaleString()}</span>
            </div>
            <Button 
              form="orderForm" 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-slate-900 rounded-2xl text-lg font-black uppercase tracking-widest gap-2 shadow-xl hover:bg-black"
            >
              {loading ? "Processing..." : "Complete Order"}
              <Send className="h-5 w-5 text-orange-500" />
            </Button>
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
              Secured with SSL Encryption [cite: 119]
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CheckoutPage;