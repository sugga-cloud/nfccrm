import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Zap, ArrowRight, CreditCard, Headset } from "lucide-react";
import { motion } from "framer-motion";

const SubscriptionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 p-10 text-center border border-slate-100 relative"
      >
        {/* Decorative Badge - Navy Blue */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-xl border border-amber-500/30">
          Locked
        </div>

        {/* Icon Header - Golden Accents */}
        <div className="relative mx-auto w-24 h-24 mb-10 mt-4">
          <div className="absolute inset-0 bg-amber-50 rounded-[2rem] rotate-12 scale-110" />
          <div className="absolute inset-0 bg-white rounded-[2rem] border-2 border-amber-100 flex items-center justify-center shadow-sm">
            <Zap className="h-10 w-10 text-amber-500 fill-amber-500" />
          </div>
        </div>

        {/* Navy Blue Text with Golden Highlight */}
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-950 mb-4 leading-none">
          No <span className="text-amber-500 text-5xl block">Active Plan!</span>
        </h1>
        
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-10">
          Get a new plan to unlock your profile
        </p>

        <div className="space-y-3">
          {/* Main Button - Navy with Golden Subtext */}
          <Button 
            onClick={() => navigate("/pricing")}
            className="w-full h-20 rounded-3xl bg-slate-950 hover:bg-slate-900 text-white flex flex-col items-center justify-center gap-0 group transition-all border-b-4 border-amber-600"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">Recommended</span>
            <span className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
              View All Plans <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-amber-500" />
            </span>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={() => navigate("/support")}
              className="h-14 rounded-2xl border-2 border-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-slate-50 hover:text-slate-950"
            >
              <Headset className="h-4 w-4 text-amber-500" /> Need Help?
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-14 rounded-2xl border-2 border-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 hover:text-slate-950"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-amber-100" />
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

export default SubscriptionExpired;