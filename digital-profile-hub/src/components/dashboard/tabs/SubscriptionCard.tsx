import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, Calendar, AlertCircle, 
  ArrowUpRight, Loader2, RefreshCw 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const SubscriptionCard = () => {
  const navigate = useNavigate();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["currentSubscription"],
    queryFn: async () => {
      try {
        const res = await api.get("/user/current-subscription");
        return res.data;
      } catch (error: any) {
        console.error("Subscription Fetch Error:", error.response?.data || error.message);
        throw error;
      }
    },
    retry: false // Avoid constant retries if plan doesn't exist
  });

  if (isLoading) return (
    <div className="h-48 w-full flex items-center justify-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );

  // 1. Logic for date calculations
  const end = subscription?.end_date ? new Date(subscription.end_date).getTime() : 0;
  const now = new Date().getTime();
  const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  
  // 2. STATE: NO PLAN AT ALL
  if (!subscription || !subscription.plan_name) {
    return (
      <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">No Active Plan</h3>
          <p className="text-sm text-slate-400 font-medium">Get a new plan to unlock your digital profile features.</p>
        </div>
        <Button onClick={() => navigate("/pricing")} className="bg-brand-gold hover:bg-brand-accent text-brand-dark rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs">
          View Plans <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  // 3. STATE: PLAN EXPIRED (0 Days Left)
  if (daysRemaining <= 0) {
    return (
      <div className="p-8 bg-rose-50 rounded-[2rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
            <AlertCircle className="text-white h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Plan Expired!</h3>
            <p className="text-sm text-slate-400 font-medium italic">Your {subscription.plan_name} plan access has ended.</p>
          </div>
        </div>
        <Button onClick={() => navigate("/pricing")} className="bg-brand-gold hover:bg-brand-accent text-brand-dark rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs">
          Renew Now <Zap className="ml-2 h-4 w-4 text-brand-dark fill-brand-dark" />
        </Button>
      </div>
    );
  }

  // 4. STATE: ACTIVE PLAN
  const start = new Date(subscription.start_date).getTime();
  const totalDuration = end - start;
  const elapsed = now - start;
  const percentage = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
  const isExpiringSoon = daysRemaining <= 5;

  return (
    <div className="relative overflow-hidden p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-white shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 blur-3xl -z-0" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Current Status</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">
              {subscription.plan_name} <span className="text-brand-gold">Member</span>
            </h2>
          </div>
          <Badge className={cn(
            "rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[9px] border-none",
            isExpiringSoon ? "bg-rose-500 text-white animate-pulse" : "bg-emerald-500 text-white"
          )}>
            {isExpiringSoon ? "Expiring Soon" : "Active"}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-widest">
                Ends {new Date(subscription.end_date).toLocaleDateString()}
              </p>
            </div>
            <p className={cn(
              "text-2xl font-black italic tracking-tighter",
              isExpiringSoon ? "text-rose-400" : "text-brand-gold"
            )}>
              {daysRemaining} Days Left
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  isExpiringSoon ? "bg-rose-500" : "bg-orange-500"
                )}
                style={{ width: `${100 - percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Initialized</span>
              <span>Completion</span>
            </div>
          </div>
        </div>

        {subscription.auto_renew && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <RefreshCw className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auto-renew is active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;