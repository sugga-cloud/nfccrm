import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Zap, ArrowRight, CreditCard, Headset } from "lucide-react";
import { motion } from "framer-motion";

const SubscriptionRestricted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 p-10 text-center border border-slate-100 relative"
      >
        {/* Decorative Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-xl">
          Locked
        </div>

        {/* Icon Header */}
        <div className="relative mx-auto w-24 h-24 mb-10 mt-4">
          <div className="absolute inset-0 bg-orange-100 rounded-[2rem] rotate-12 scale-110" />
          <div className="absolute inset-0 bg-white rounded-[2rem] border-2 border-slate-100 flex items-center justify-center shadow-sm">
            <Zap className="h-10 w-10 text-orange-500 fill-orange-500" />
          </div>
        </div>

        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-4 leading-none">
          No <span className="text-orange-500 text-5xl block">Active Plan!</span>
        </h1>
        
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-10">
          Get a new plan to unlock your profile
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/pricing")}
            className="w-full h-20 rounded-3xl bg-slate-900 hover:bg-black text-white flex flex-col items-center justify-center gap-0 group transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">Recommended</span>
            <span className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
              View All Plans <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={() => navigate("/support")}
              className="h-14 rounded-2xl border-2 border-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest gap-2"
            >
              <Headset className="h-4 w-4" /> Need Help?
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-14 rounded-2xl border-2 border-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
            Join 2,000+ Active Users
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionRestricted;