import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartFloatingButton = () => {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    const cart = JSON.parse(localStorage.getItem("nfc_cart") || "[]");
    const totalItems = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    setCount(totalItems);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 20 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button 
          onClick={() => window.location.href = '/checkout'} // Link to Payment Gateway 
          className="relative h-16 w-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-orange-500 transition-colors group"
        >
          <ShoppingBag className="h-6 w-6 group-hover:scale-110 transition-transform" />
          
          {/* Badge */}
          <span className="absolute -top-1 -right-1 h-6 w-6 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white">
            {count}
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartFloatingButton;