import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { 
  RefreshCw, TrendingUp, MousePointer2, 
  CalendarCheck, MessageSquare, HardDrive, 
  ArrowUpRight, AlertCircle, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import SubscriptionCard from "./SubscriptionCard";

const AnalyticsTab = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["profileAnalytics"],
    queryFn: async () => {
      const res = await api.get("/my-profile");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-6 bg-brand-dark rounded-[3rem] border border-white/5">
      <div className="relative">
        <RefreshCw className="h-12 w-12 animate-spin text-brand-gold" />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-white" />
      </div>
      <p className="font-black italic uppercase tracking-[0.4em] text-[10px] text-slate-500">Decrypting Analytics...</p>
    </div>
  );

  if (error) return (
    <div className="p-10 bg-red-500/5 rounded-[3rem] border border-red-500/20 text-red-400 flex flex-col items-center gap-4 text-center">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <div className="space-y-1">
        <h3 className="font-black uppercase tracking-tighter text-xl">Data Sync Interrupted</h3>
        <p className="text-xs font-bold uppercase tracking-widest opacity-60">System could not retrieve performance metrics.</p>
      </div>
      <Button onClick={() => refetch()} variant="outline" className="mt-4 border-red-500/30 hover:bg-red-500/10 text-red-400 font-black uppercase tracking-widest text-[10px] rounded-xl">
        Attempt Reconnection
      </Button>
    </div>
  );

  // --- DATA PROCESSING ---
  const stats = data?.analytics || {};
  const storage = data?.storage || {};
  const plan = data?.plan || { name: "Basic", limit: 10 };

  const limitMb = plan.limit;
  const rawUsedMb = parseFloat(storage.used_space_mb || 0);
  const usedMb = rawUsedMb < 0 ? 0 : rawUsedMb; 
  const storagePercentage = Math.min((usedMb / limitMb) * 100, 100);

  const chartData = [
    { name: "Visits", value: stats.visit_count || 0, color: "#D4AF37" },
    { name: "Clicks", value: stats.click_count || 0, color: "#94a3b8" },
    { name: "Bookings", value: stats.appointment_count || 0, color: "#f97316" },
    { name: "Enquiries", value: stats.enquiry_count || 0, color: "#ffffff" },
  ];

  return (
    <div className="space-y-10 p-2 animate-in fade-in duration-700">
      <SubscriptionCard />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
            Performance <span className="text-brand-gold">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mt-2">
            Asset Monitoring & Engagement Metrics
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="rounded-2xl border-white/10 font-black uppercase tracking-[0.2em] text-[10px] h-14 px-8 bg-white/[0.03] backdrop-blur-xl hover:bg-brand-gold/10 hover:text-brand-gold transition-all shadow-2xl"
        >
          <RefreshCw className={cn("mr-3 h-4 w-4", isFetching && "animate-spin")} />
          {isFetching ? "Syncing Dossier..." : "Sync Intelligence"}
        </Button>
      </div>

      {/* 1. Storage Usage Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 via-brand-dark to-brand-dark p-10 border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-brand-gold shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <HardDrive className="h-10 w-10 text-brand-dark" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
                Vault <span className="text-brand-gold">Capacity</span>
              </h2>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{plan.name} Tier</span>
                <div className="h-1 w-1 rounded-full bg-brand-gold/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">{plan.limit}MB Allocated</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Encrypted Storage Used</span>
                <span className="text-3xl font-black text-white italic tracking-tighter">{usedMb.toFixed(2)} <span className="text-sm text-slate-500 not-italic tracking-normal">MB</span></span>
              </div>
              <span className={cn(
                "text-[10px] font-black px-4 py-2 rounded-xl border tracking-widest",
                storagePercentage > 80 ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-brand-gold/10 border-brand-gold/20 text-brand-gold"
              )}>
                {storagePercentage.toFixed(1)}% OCCUPIED
              </span>
            </div>
            <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1 backdrop-blur-md">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${storagePercentage}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  storagePercentage > 90 ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-gradient-to-r from-brand-gold to-yellow-200 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                )}
              />
            </div>
          </div>

          <Button onClick={()=>navigate('/pricing')} className="btn-gold rounded-2xl px-10 h-16 font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
            Expand Capacity <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* 2. Engagement Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {chartData.map((d, idx) => (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl rounded-[2.5rem] group hover:border-brand-gold/30 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
                <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  {d.name}
                </CardTitle>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-brand-gold/10 group-hover:border-brand-gold/20 transition-all">
                   <TrendingUp className="h-4 w-4 text-brand-gold" />
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-5xl font-black italic tracking-tighter text-white group-hover:scale-110 origin-left transition-transform duration-500">
                  {d.value.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Live Delta</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. Visual Bar Chart */}
      <Card className="p-10 border border-white/10 bg-white/[0.01] backdrop-blur-md rounded-[3.5rem] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Engagement <span className="text-brand-gold">Topology</span></h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Interaction density per category</p>
          </div>
          <div className="flex gap-2">
            {chartData.map((item) => (
               <div key={item.name} className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
                 <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.name}</span>
               </div>
            ))}
          </div>
        </div>
        <div className="h-[450px] w-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}
                dy={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 24 }}
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  borderRadius: '24px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  padding: '20px'
                }}
                itemStyle={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', color: '#D4AF37' }}
              />
              <Bar dataKey="value" radius={[16, 16, 16, 16]} barSize={80}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="hover:opacity-80 transition-opacity" 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsTab;