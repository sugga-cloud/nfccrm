import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/api/api";
import { 
  CreditCard, ArrowUpRight, Search, 
  DownloadCloud, History, User,
  CheckCircle2, Clock, AlertCircle,
  TrendingUp, Wallet
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PaymentsTab = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/payments") 
      .then((res) => {
        // According to your JSON: { "payments": [...] }
        // We ensure we are grabbing the array inside the object
        const dataArray = res.data.payments || res.data; 
        setPayments(Array.isArray(dataArray) ? dataArray : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        toast.error("Failed to sync financial ledger");
        setLoading(false);
      });
  }, []);

  // Calculate Stats based on the payments array
  const totalRevenue = payments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const successfulTxns = payments.filter(p => p.status === 'success').length;

  // Search Logic
  const filtered = payments.filter((p: any) => 
    p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
    p.user_id?.toString().includes(search) ||
    p.status?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="h-12 w-12 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="w-full space-y-8 p-2 md:p-6">
      
      {/* 1. Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] text-white">
          <div className="flex items-center gap-3 mb-4 text-brand-gold">
            <TrendingUp className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Collection</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter italic">₹{totalRevenue.toLocaleString('en-IN')}</h2>
        </div>

        <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Successful TXNs</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter italic text-white">{successfulTxns}</h2>
        </div>

        <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
          <div className="flex items-center gap-3 mb-4 text-brand-gold">
            <Wallet className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gateway</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">Razorpay</h2>
        </div>
      </div>

      {/* 2. Header & Search Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <History className="h-4 w-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Transaction Registry</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
            Payment <span className="text-brand-gold">Tracking</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-gold transition-colors" />
            <Input 
              placeholder="Search TXN ID or User ID..." 
              className="pl-11 h-12 rounded-2xl bg-white/5 border border-white/10 focus-visible:ring-brand-gold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 p-0 hover:bg-white/10">
            <DownloadCloud className="h-5 w-5 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* 3. The Ledger List */}
      <div className="space-y-3">
        {/* Table Headings (Desktop Only) */}
        <div className="hidden md:grid grid-cols-12 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="col-span-4">Transaction Details</div>
          <div className="col-span-3">Entity Mapping</div>
          <div className="col-span-2 text-center">Amount</div>
          <div className="col-span-3 text-right">Gateway Status</div>
        </div>

        {filtered.map((p: any, idx) => (
          <motion.div
            key={p.id || idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-5 md:p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:border-brand-gold/40 transition-all group"
          >
            {/* COLUMN 1: TXN ID & Date */}
            <div className="col-span-1 md:col-span-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/10 text-slate-400 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-dark transition-all">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Ref ID</span>
                <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-tighter">
                  {p.transaction_id || `REF-000${p.id}`}
                </p>
                <p className="text-sm font-black italic uppercase tracking-tighter text-white mt-1">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  }) : 'Date Unknown'}
                </p>
              </div>
            </div>

            {/* COLUMN 2: System IDs (User & Sub) */}
            <div className="col-span-1 md:col-span-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Mapping</span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-black text-white tracking-tighter italic">
                    UID-{p.user_id || 'N/A'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.15em] mt-1 ml-8">
                  SUB ID: {p.subscription_id || 'NONE'}
                </p>
              </div>
            </div>

            {/* COLUMN 3: Amount */}
            <div className="col-span-1 md:col-span-2 text-left md:text-center">
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block md:hidden mb-1">Value</span>
              <span className="text-xl font-black italic tracking-tighter text-white">
                ₹{Number(p.amount || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* COLUMN 4: Status Badge */}
            <div className="col-span-1 md:col-span-3 flex justify-start md:justify-end">
              <div className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] border shadow-sm",
                p.status === "success" 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-amber-50 text-amber-600 border-amber-100"
              )}>
                {p.status === "success" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3 animate-pulse" />
                )}
                {p.status || 'Pending'}
                <ArrowUpRight className="h-3 w-3 opacity-30 ml-1" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="p-20 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No transaction history found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsTab;