import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Edit2, Trash2, Plus, Loader2, CheckCircle2, 
  Crown, Calendar, Zap, AlertCircle, HardDrive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PlansTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  
  // UI State for the form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationValue: "1",
    durationUnit: "months",
    storageValue: "100",
    storageUnit: "MB",
    features: ""
  });

  // --- 1. FETCH DATA ---
  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ["adminPlans"],
    queryFn: async () => {
      const res = await api.get("/admin/plans");
      return res.data;
    },
  });

  // --- 2. CREATE / UPDATE MUTATION ---
  const upsertMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingPlan) {
        return api.put(`/admin/plans/${editingPlan.id}`, payload);
      }
      return api.post("/admin/plans", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
      toast.success(editingPlan ? "Tier updated" : "New tier launched");
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      console.log(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  });

  // --- 3. DELETE MUTATION ---
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/admin/plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
      toast.success("Plan removed");
    }
  });

  const handleOpenModal = (plan: any = null) => {
    if (plan) {
      setEditingPlan(plan);
      // Logic to reverse-calculate units for editing if needed, 
      // but for simplicity we reset to defaults or raw days
      setFormData({
        name: plan.name,
        price: plan.price.toString(),
        durationValue: plan.duration.toString(),
        durationUnit: "days",
        storageValue: plan.storage_limit ? (plan.storage_limit >= 1024 ? (plan.storage_limit / 1024).toString() : plan.storage_limit.toString()) : "100",
        storageUnit: plan.storage_limit >= 1024 ? "GB" : "MB",
        features: Array.isArray(plan.features) ? plan.features.join(", ") : ""
      });
    } else {
      setEditingPlan(null);
      setFormData({ 
        name: "", price: "", durationValue: "1", durationUnit: "months", 
        storageValue: "100", storageUnit: "MB", features: "" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Conversion to standard DB units (Days and MB)
    let finalDays = parseInt(formData.durationValue);
    if (formData.durationUnit === "months") finalDays *= 30;
    if (formData.durationUnit === "years") finalDays *= 365;

    let finalMB = parseInt(formData.storageValue);
    if (formData.storageUnit === "GB") finalMB *= 1024;

    const payload = {
      name: formData.name,
      price: formData.price,
      duration: finalDays,
      limit: finalMB,
      features: formData.features.split(",").map(f => f.trim()).filter(f => f !== "")
    };
    
    upsertMutation.mutate(payload);
  };

  if (isLoading) return (
    <div className="flex h-96 flex-col items-center justify-center text-brand-gold gap-4">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p className="font-black italic uppercase tracking-widest text-xs">Syncing Tiers...</p>
    </div>
  );

  return (
    <div className="w-full space-y-8 p-2 md:p-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">
            Platform <span className="text-brand-gold underline decoration-brand-gold/40 decoration-8 underline-offset-4">Tiers</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-3">
            Pricing Architecture & Feature Access
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="h-14 px-8 rounded-2xl bg-brand-gold hover:bg-brand-accent text-brand-dark font-black uppercase tracking-widest text-xs gap-3 transition-all shadow-2xl shadow-brand-gold/20"
        >
          <Plus className="h-5 w-5 text-brand-dark" /> New Tier
        </Button>
      </div>

      {/* Tiers Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {plans.map((plan: any, idx: number) => (
            <motion.div
              key={plan.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="group relative flex flex-col h-full rounded-[3rem] border border-white/10 shadow-none hover:-translate-y-1 transition-all duration-500 bg-white/5 overflow-hidden">
                <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform">
                  <Crown className="h-32 w-32" />
                </div>

                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                      <Zap className="h-6 w-6 text-slate-400 group-hover:text-orange-500" />
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Fee</span>
                      <span className="text-2xl font-black italic tracking-tighter text-white">₹{plan.price}</span>
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-black italic uppercase tracking-tighter text-white">
                    {plan.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-8 flex-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-white/10 text-slate-300 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest gap-1.5">
                      <Calendar className="h-3 w-3" /> {plan.duration} Days
                    </Badge>
                    <Badge variant="secondary" className="bg-brand-gold/20 text-brand-gold border border-brand-gold/30 rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest gap-1.5">
                      <HardDrive className="h-3 w-3" /> {plan.limit >= 1024 ? `${plan.limit / 1024} GB` : `${plan.limit} MB`}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {Array.isArray(plan.features) && plan.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-4 grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 border-white/10 hover:bg-white/10 text-white" 
                    onClick={() => handleOpenModal(plan)}
                  >
                    <Edit2 className="h-3 w-3 mr-2 text-brand-gold" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 text-red-400 hover:bg-red-500/10"
                    onClick={() => { if(confirm("Archive this tier?")) deleteMutation.mutate(plan.id) }}
                  >
                    <Trash2 className="h-3 w-3 mr-2" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-[3rem] sm:max-w-[500px] border border-white/10 shadow-2xl p-0 overflow-hidden bg-brand-dark">
          <div className="bg-white/5 border-b border-white/10 p-10 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl" />
            <DialogHeader>
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter relative z-10">
                Tier <span className="text-brand-gold">Architecture</span>
              </DialogTitle>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Configure Limits & Pricing</p>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-brand-dark">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plan Identity</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="h-14 rounded-2xl bg-white/5 border border-white/10 font-bold text-lg"
                placeholder="PRO MEMBERSHIP"
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price (₹)</label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="h-14 rounded-2xl bg-white/5 border border-white/10 font-black" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Storage</label>
                <div className="flex gap-2">
                  <Input type="number" value={formData.storageValue} onChange={(e) => setFormData({...formData, storageValue: e.target.value})} className="h-14 rounded-2xl bg-white/5 border border-white/10 font-black w-full" />
                  <Select value={formData.storageUnit} onValueChange={(v) => setFormData({...formData, storageUnit: v})}>
                    <SelectTrigger className="w-24 h-14 rounded-2xl bg-white/5 border border-white/10 font-black text-[10px] uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="MB">MB</SelectItem>
                      <SelectItem value="GB">GB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plan Validity</label>
              <div className="flex gap-2">
                <Input type="number" value={formData.durationValue} onChange={(e) => setFormData({...formData, durationValue: e.target.value})} className="h-14 rounded-2xl bg-white/5 border border-white/10 font-black w-full" />
                <Select value={formData.durationUnit} onValueChange={(v) => setFormData({...formData, durationUnit: v})}>
                  <SelectTrigger className="w-32 h-14 rounded-2xl bg-white/5 border border-white/10 font-black text-[10px] uppercase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Features</label>
              <textarea 
                className="w-full min-h-[100px] p-5 rounded-[2rem] bg-white/5 border border-white/10 text-sm font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-brand-gold outline-none"
                value={formData.features} 
                onChange={(e) => setFormData({...formData, features: e.target.value})} 
                placeholder="Feature 1, Feature 2, Feature 3..." 
              />
            </div>

            <Button 
              type="submit" 
              disabled={upsertMutation.isPending} 
              className="w-full h-20 bg-brand-gold hover:bg-brand-accent text-brand-dark rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-brand-gold/20 transition-all group"
            >
              {upsertMutation.isPending ? <Loader2 className="animate-spin" /> : (
                <span className="flex items-center gap-3">
                  {editingPlan ? "Update Tier" : "Launch Tier"}
                  <Zap className="h-4 w-4 text-brand-dark fill-brand-dark group-hover:scale-125 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansTab;