import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { 
  HardDrive, Search, User, 
  AlertTriangle, Database, ArrowUpRight, Loader2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const StorageTab = () => {
  const [search, setSearch] = useState("");

  // --- 1. FETCH STORAGE STATS WITH CACHE ---
  const { data: storageStats = [], isLoading, isFetching } = useQuery({
    queryKey: ["adminStorageStats"],
    queryFn: async () => {
      try{
      const res = await api.get("/admin/storage-stats");
      console.log(res.data);
      return res.data;}
      catch(er){
        console.log(er.response.data);
        throw new Error("Failed to fetch");
        
      }
    },
    // Keep data fresh for 2 minutes, as storage doesn't change every second
    staleTime: 1000 * 60 * 2, 
  });

  const filtered = storageStats.filter((u: any) => 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex h-96 flex-col items-center justify-center text-orange-500 gap-4">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p className="font-black italic uppercase tracking-widest text-xs">Scanning Node Storage...</p>
    </div>
  );

  return (
    <div className="w-full space-y-8 p-2 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database className={cn("h-4 w-4 text-orange-500", isFetching && "animate-pulse")} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {isFetching ? "Syncing Live Data..." : "Resource Infrastructure"}
            </span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
            Storage <span className="text-orange-500">Quotas</span>
          </h1>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <Input 
            placeholder="Search users..." 
            className="pl-11 h-12 rounded-2xl bg-white border-slate-100 shadow-sm focus-visible:ring-orange-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Wide Monitoring List */}
      <div className="space-y-3">
        {/* Table Headings - Desktop */}
        <div className="hidden md:grid grid-cols-12 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="col-span-4">User Node</div>
          <div className="col-span-6 text-center">Usage Distribution</div>
          <div className="col-span-2 text-right">Available Space</div>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.map((user: any, idx: number) => {
            const rawUsed = parseFloat(user.used_mb || 0);
            const usedMb = rawUsed < 0 ? 0 : rawUsed; // Fix for negative value glitch
            const percentage = Math.min(Math.round((usedMb / user.limit_mb) * 100), 100);
            const isCritical = percentage > 85;
            const isWarning = percentage > 60 && percentage <= 85;

            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.02 }}
                className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-6 bg-white rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all group"
              >
                {/* User Identity */}
                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-lg",
                    isCritical ? "bg-rose-500 text-white" : "bg-slate-900 text-white"
                  )}>
                    <HardDrive className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black italic uppercase tracking-tighter text-slate-900 group-hover:text-orange-500 transition-colors">
                      {user.username}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-0.5">
                      <br/>Plan: {user.plan}
                    </div>
                  </div>
                </div>

                {/* Progress & Visualizer */}
                <div className="col-span-1 md:col-span-6 space-y-3">
                  <div className="flex justify-between items-end mb-1 px-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="text-slate-900">{usedMb.toFixed(1)}MB</span> / {user.limit_mb}MB
                    </p>
                    <div className="flex items-center gap-1">
                      {isCritical && <AlertTriangle className="h-3 w-3 text-rose-500 animate-pulse" />}
                      <span className={cn(
                        "text-sm font-black italic tracking-tighter",
                        isCritical ? "text-rose-500" : isWarning ? "text-amber-500" : "text-emerald-500"
                      )}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full transition-colors duration-500",
                        isCritical ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
                      )}
                    />
                  </div>
                </div>

                {/* Quick Action / Remaining */}
                <div className="col-span-1 md:col-span-2 text-right">
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Available</p>
                    <p className="text-sm font-bold text-slate-900">
                      {Math.max(0, user.limit_mb - usedMb).toFixed(1)} MB
                    </p>
                  </div>
                  <button className="md:hidden w-full flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    View Details <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StorageTab;