import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Search, User, ShieldCheck, ShieldAlert, 
  ExternalLink, MoreHorizontal, Mail, Fingerprint,
  Calendar, CreditCard, ChevronDown, Clock
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ProfilesList = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    api.get("/admin/profiles")
      .then((res) => {
        setProfiles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load profiles");
        setLoading(false);
      });
  }, []);

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/profiles/${id}/toggle`);
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
      );
      toast.success(`User ${currentStatus ? 'suspended' : 'activated'}`);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const filtered = profiles.filter((p) => 
    p.username.toLowerCase().includes(search.toLowerCase()) || 
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to calculate days left
  const getDaysLeft = (expiry: string) => {
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 p-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
            Control <span className="text-orange-500">Center</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Deep-dive into user tiers, billing cycles, and system access.
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <Input 
            placeholder="Search identity..." 
            className="pl-11 h-12 rounded-2xl bg-white border-slate-200 shadow-sm focus-visible:ring-orange-500" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="col-span-4">Identity & Contact</div>
          <div className="col-span-3">Current Tier</div>
          <div className="col-span-3">System Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <AnimatePresence>
          {filtered.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col bg-white rounded-[2.5rem] border transition-all overflow-hidden",
                expandedId === p.id ? "border-orange-200 shadow-xl" : "border-slate-100 shadow-sm"
              )}
            >
              {/* Main Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 md:p-6">
                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-[1.2rem] bg-slate-900 flex items-center justify-center text-orange-500 shadow-lg">
                    <User className="h-7 w-7" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-black italic uppercase tracking-tighter text-lg text-slate-900 truncate">
                      {p.username}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold truncate">
                      <Fingerprint className="h-3 w-3" /> ID: {p.user_id}
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3">
                  <Badge className={cn(
                    "rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[9px] border-none",
                    p.plan_detail ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {p.plan}
                  </Badge>
                </div>

                <div className="col-span-1 md:col-span-3 flex items-center gap-2">
                   <div className={cn(
                     "h-2 w-2 rounded-full",
                     p.is_active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                   )} />
                   <span className={cn(
                     "text-[10px] font-black uppercase tracking-widest",
                     p.is_active ? "text-emerald-600" : "text-rose-600"
                   )}>
                     {p.is_active ? "Active Link" : "Access Denied"}
                   </span>
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3">
                  <Switch 
                    checked={!!p.is_active} 
                    onCheckedChange={() => toggleStatus(p.id, !!p.is_active)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("rounded-xl transition-transform", expandedId === p.id && "rotate-180")}
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  >
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </Button>
                </div>
              </div>

              {/* Deep Info Section */}
              <AnimatePresence>
                {expandedId === p.id && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="bg-slate-50/50 border-t border-slate-100 overflow-hidden"
                  >
                    <div className="p-8 grid md:grid-cols-3 gap-8">
                      {/* Subscription Deep Dive */}
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Snapshot</p>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400">Total Value</span>
                            <span className="text-sm font-black italic tracking-tight">₹{p.plan_detail?.price || '0.00'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400">Method</span>
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-900">
                              <CreditCard className="h-3 w-3" /> Razorpay
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expiry / Timeline */}
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lifecycle Timeline</p>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400">Valid Until</span>
                            <span className="text-xs font-bold text-slate-900">{p.plan_detail?.expiry || 'N/A'}</span>
                          </div>
                          {p.plan_detail && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[60%]" />
                              </div>
                              <span className="text-[10px] font-black text-orange-600 uppercase">
                                {getDaysLeft(p.plan_detail.expiry)} Days Left
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Administrative Actions */}
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quick Actions</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex gap-2 w-full">
  {/* The Mailto Button */}
  <Button 
    variant="outline" 
    className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest gap-2"
    asChild
  >
    <a href={`mailto:${p.email}`}>
      <Mail className="h-3 w-3" /> Email
    </a>
  </Button>

  {/* The Copy Button */}
  <Button 
    variant="ghost" 
    size="icon"
    className="h-12 w-12 rounded-xl border border-slate-100 hover:bg-slate-100"
    onClick={() => {
      navigator.clipboard.writeText(p.email);
      toast.success("Email copied to clipboard!");
    }}
  >
    <Fingerprint className="h-4 w-4 text-slate-400" />
  </Button>
</div>
                          <Button 
                            variant="outline" 
                            className="rounded-xl h-12 text-[10px] font-black uppercase tracking-widest gap-2 text-orange-500 border-orange-100 hover:bg-orange-50"
                            onClick={() => window.open(`/${p.username}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" /> Portal
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilesList;