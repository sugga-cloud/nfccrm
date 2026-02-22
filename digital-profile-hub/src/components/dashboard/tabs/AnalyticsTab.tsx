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
  ArrowUpRight, AlertCircle 
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
      try {
        const res = await api.get("/my-profile");
        // We return the whole res.data so we can access .storage and .analytics
        console.log(res.data);
        return res.data;
      } catch (er: any) {
        console.error("Backend Error:", er.response?.data?.message || er.message);
        throw er.response?.data || new Error("Network Error");
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center text-orange-500 gap-4">
      <RefreshCw className="h-8 w-8 animate-spin" />
      <span className="font-black italic uppercase tracking-widest text-xs">Gathering Insights...</span>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100 text-red-600 flex items-center gap-3">
      <AlertCircle className="h-5 w-5" />
      <span className="font-bold">Failed to load analytics. Please try again later.</span>
    </div>
  );

  // --- DATA PROCESSING ---
  const stats = data?.analytics || {};
  const storage = data?.storage || {};
  const plan = data.plan || {};
  // Storage Logic: Handling your -1.81MB glitch and calculating percentage
  const limitMb = plan.limit; // Starter Plan Limit
  const rawUsedMb = parseFloat(storage.used_space_mb || 0);
  const usedMb = rawUsedMb < 0 ? 0 : rawUsedMb; // Floor at 0
  const storagePercentage = Math.min((usedMb / limitMb) * 100, 100);

  const chartData = [
    { name: "Visits", value: stats.visit_count || 0, icon: TrendingUp, color: "#f97316" },
    { name: "Clicks", value: stats.click_count || 0, icon: MousePointer2, color: "#fb923c" },
    { name: "Bookings", value: stats.appointment_count || 0, icon: CalendarCheck, color: "#ea580c" },
    { name: "Enquiries", value: stats.enquiry_count || 0, icon: MessageSquare, color: "#c2410c" },
  ];

  return (
    <div className="space-y-8 p-2 md:p-4">
      <SubscriptionCard />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
            Performance <span className="text-orange-500">Overview</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Real-time engagement and resource tracking
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="rounded-2xl border-slate-200 font-bold uppercase tracking-widest text-[10px] h-12 px-6 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all"
        >
          <RefreshCw className={cn("mr-2 h-3 w-3", isFetching && "animate-spin")} />
          {isFetching ? "Syncing..." : "Refresh Data"}
        </Button>
      </div>

      {/* 1. Storage Usage Card (Modern High-Contrast) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 shadow-2xl"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 shadow-lg shadow-orange-500/20">
              <HardDrive className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                Cloud <span className="text-orange-500">Storage</span>
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{plan.name}</span>
                <span className="h-1 w-1 rounded-full bg-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">{plan.limit}MB Total</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="flex justify-between items-end mb-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Usage</span>
                <span className="text-xl font-black text-white">{usedMb.toFixed(2)} <span className="text-sm text-slate-500">MB</span></span>
              </div>
              <span className={cn(
                "text-xs font-black px-3 py-1 rounded-lg",
                storagePercentage > 80 ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
              )}>
                {storagePercentage.toFixed(1)}% USED
              </span>
            </div>
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${storagePercentage}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={cn(
                  "h-full rounded-full transition-colors duration-500",
                  storagePercentage > 90 ? "bg-red-500" : "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                )}
              />
            </div>
          </div>

          <Button onClick={()=>navigate('/pricing')} className="rounded-2xl bg-white text-slate-900 hover:bg-orange-500 hover:text-white font-black italic uppercase tracking-tighter px-8 h-14 transition-all">
            Upgrade Plan <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/5 blur-[100px]" />
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
            <Card className="overflow-hidden border-none shadow-xl ring-1 ring-slate-100 hover:ring-orange-200 transition-all group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {d.name}
                </CardTitle>
                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-orange-50 transition-colors">
                  <d.icon className="h-4 w-4 text-slate-400 group-hover:text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black italic tracking-tighter text-slate-900 group-hover:text-orange-600 transition-colors">
                  {d.value.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <TrendingUp className="h-2 w-2" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase italic">Active Growth</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. Visual Bar Chart */}
      <Card className="p-8 border-none shadow-2xl ring-1 ring-slate-100 rounded-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Activity <span className="text-orange-500">Distribution</span></h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comparison of user interactions</p>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f8fafc" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }}
                dy={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: '#fff7ed', radius: 12 }}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }}
                itemStyle={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
              />
              <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={60}>
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