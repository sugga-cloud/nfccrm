import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/api/api";
import { 
  Key, ShieldCheck, Globe, FlaskConical, 
  Save, Trash2, Link, RefreshCcw, 
  AlertTriangle, Power
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const RazorpayConfigTab = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    live_key_id: "",
    live_key_secret: "",
    test_key_id: "",
    test_key_secret: "",
    webhook_secret: "",
    webhook_url: "",
    is_live: false,
  });

  // Fetch existing config on load
  useEffect(() => {
    setLoading(true);
    api.get("/admin/razorpay-settings")
      .then((res) => {
        if (res.data) setConfig(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load gateway configuration");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    try {
      await api.post("/admin/update-razorpay-settings", config);
      toast.success("Financial credentials updated successfully");
    } catch (err: any) {
      toast.error("Encryption failed: Check server logs");
      console.log(err.response.data.message);
    }
  };

  const clearConfig = () => {
    if (confirm("Are you sure? This will disconnect your payment gateway.")) {
      setConfig({
        live_key_id: "", live_key_secret: "",
        test_key_id: "", test_key_secret: "",
        webhook_secret: "", webhook_url: "",
        is_live: false,
      });
    }
  };

  return (
    <div className="w-full space-y-8 p-2 md:p-6 text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Security Vault</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            Gateway <span className="text-brand-gold text-5xl">Credentials</span>
          </h1>
        </div>

        {/* Live/Test Toggle */}
        <div className={cn(
          "flex items-center gap-4 p-4 rounded-3xl border transition-all",
          config.is_live ? "bg-emerald-500/10 border-emerald-500/50" : "bg-amber-500/10 border-amber-500/50"
        )}>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Environment</span>
            <span className={cn("font-black italic uppercase tracking-tighter", config.is_live ? "text-emerald-400" : "text-amber-500")}>
              {config.is_live ? "Production / Live" : "SandBox / Test"}
            </span>
          </div>
          <Switch 
            checked={config.is_live} 
            onCheckedChange={(val) => setConfig({...config, is_live: val})}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Test Credentials Block */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <FlaskConical className="h-6 w-6 text-amber-500" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Test <span className="text-slate-400">Mode</span></h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Test Key ID</label>
              <Input 
                value={config.test_key_id}
                onChange={(e) => setConfig({...config, test_key_id: e.target.value})}
                placeholder="rzp_test_..." 
                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-brand-gold transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Test Key Secret</label>
              <Input 
                type="password"
                value={config.test_key_secret}
                onChange={(e) => setConfig({...config, test_key_secret: e.target.value})}
                placeholder="••••••••••••••••" 
                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-brand-gold transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Live Credentials Block */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-brand-gold/20 p-8 rounded-[3rem] space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe className="h-32 w-32" />
          </div>
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Globe className="h-6 w-6 text-brand-gold" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-brand-gold text-2xl">Live <span className="text-white">Mode</span></h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-gold/60 ml-2">Live Key ID</label>
              <Input 
                value={config.live_key_id}
                onChange={(e) => setConfig({...config, live_key_id: e.target.value})}
                placeholder="rzp_live_..." 
                className="h-14 rounded-2xl bg-white/10 border-brand-gold/20 focus:border-brand-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-gold/60 ml-2">Live Key Secret</label>
              <Input 
                type="password"
                value={config.live_key_secret}
                onChange={(e) => setConfig({...config, live_key_secret: e.target.value})}
                placeholder="••••••••••••••••" 
                className="h-14 rounded-2xl bg-white/10 border-brand-gold/20 focus:border-brand-gold"
              />
            </div>
          </div>
        </motion.div>

        {/* Webhook Settings Block */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-slate-950 border border-white/10 p-8 rounded-[3rem] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Link className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Webhook <span className="text-slate-400">Endpoint</span></h3>
            </div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Required for real-time sync</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Webhook URL</label>
              <div className="relative">
                <Input 
                  value={config.webhook_url}
                  readOnly
                  className="h-14 rounded-2xl bg-white/5 border-white/10 text-blue-300 font-mono text-xs pr-24"
                />
                <Button variant="ghost" className="absolute right-2 top-2 h-10 text-[10px] font-black uppercase hover:text-brand-gold">Copy</Button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Webhook Secret</label>
              <Input 
                value={config.webhook_secret}
                onChange={(e) => setConfig({...config, webhook_secret: e.target.value})}
                placeholder="Your Razorpay Webhook Secret" 
                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-brand-gold"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-white/5">
        <Button 
          onClick={handleSave}
          className="h-20 flex-1 rounded-3xl bg-brand-gold hover:bg-amber-600 text-black flex flex-col items-center justify-center gap-0 group transition-all"
        >
          <span className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Save className="h-5 w-5" /> Secure & Sync Gateway
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Encrypts data automatically</span>
        </Button>

        <Button 
          variant="outline"
          onClick={clearConfig}
          className="h-20 px-10 rounded-3xl border-2 border-red-500/20 text-red-500 font-black uppercase italic hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 className="h-5 w-5 mb-1" />
          <span className="block text-[10px] tracking-widest mt-1">Disconnect</span>
        </Button>
      </div>
    </div>
  );
};

export default RazorpayConfigTab;