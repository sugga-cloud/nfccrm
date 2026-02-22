import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX, Mail, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const ProfileDisabled = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-red-50"
      >
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-red-100 rounded-3xl -rotate-6" />
          <div className="absolute inset-0 bg-red-600 rounded-3xl flex items-center justify-center shadow-lg shadow-red-200">
            <ShieldX className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
          Profile <span className="text-red-600">Disabled</span>
        </h1>
        
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
          This profile has been disabled by the system administrator. You no longer have permission to access this portal or its services.
        </p>

        <div className="space-y-3">
          <Button 
            variant="outline"
            className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px] gap-2 hover:bg-slate-50"
            onClick={() => window.location.href = "mailto:support@yourdomain.com"}
          >
            <Mail className="h-4 w-4" /> Contact Support
          </Button>

          <Button 
            onClick={handleLogout}
            className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl"
          >
            <LogOut className="h-4 w-4" /> Return to Login
          </Button>
        </div>

        <p className="mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
          Security Reference: ERR_PROFILE_DISABLED
        </p>
      </motion.div>
    </div>
  );
};

export default ProfileDisabled;