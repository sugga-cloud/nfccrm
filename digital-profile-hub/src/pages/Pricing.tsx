import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, Crown, Loader2, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge"; 
import MainLayout from "@/components/layout/MainLayout";
import SubscriptionExpiredModal from "@/components/SubscriptionExpiredModal";
import api from "@/api/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const getPlanIcon = (name: string) => {
  const n = name.toLowerCase();
  // Matching icons to the luxury theme
  if (n.includes("pro")) return <Zap className="h-5 w-5 text-brand-gold" />;
  if (n.includes("business") || n.includes("corp")) return <Crown className="h-5 w-5 text-brand-gold" />;
  return <Sparkles className="h-5 w-5 text-slate-400" />;
};

const Pricing = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearly, setYearly] = useState(false);
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to load plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <MainLayout>
      <section className="bg-brand-dark min-h-screen py-24 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-gold/5 blur-[120px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-gold text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Infinity className="h-3.5 w-3.5" /> Premium Tiers
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white leading-tight">
              Elevate Your <br />
              <span className="bg-gold-gradient bg-clip-text text-transparent lowercase tracking-normal px-2">
                Influence.
              </span>
            </h1>
            
            <p className="text-slate-400 font-medium max-w-md mx-auto text-lg">
              Choose an elite plan tailored for modern professionals and growing enterprises.
            </p>

            {/* Toggle Switch */}
            <div className="pt-10 flex items-center justify-center gap-6">
              <span className={cn("text-xs font-black uppercase tracking-widest transition-colors", !yearly ? "text-brand-gold" : "text-slate-500")}>Monthly</span>
              <Switch 
                checked={yearly} 
                onCheckedChange={setYearly} 
                className="data-[state=checked]:bg-brand-gold data-[state=unchecked]:bg-slate-800 border-none" 
              />
              <span className={cn("text-xs font-black uppercase tracking-widest transition-colors", yearly ? "text-brand-gold" : "text-slate-500")}>
                Yearly <span className="text-brand-dark font-black text-[9px] bg-brand-gold px-2 py-0.5 rounded-md ml-2 shadow-[0_0_10px_rgba(212,175,55,0.3)]">SAVE ~17%</span>
              </span>
            </div>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3 items-start px-4">
            {loading ? (
              <div className="col-span-full flex flex-col items-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-brand-gold" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Executive Tiers...</p>
              </div>
            ) : (
              <AnimatePresence>
                {plans.map((plan, idx) => {
                  const isPro = plan.name.toLowerCase().includes("pro");
                  const displayPrice = yearly ? Math.floor(plan.price * 10) : plan.price;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="h-full"
                    >
                      <Card className={cn(
                        "relative flex flex-col h-full rounded-[3rem] transition-all duration-500 overflow-hidden",
                        isPro 
                          ? "bg-white/5 border-brand-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-105 z-10" 
                          : "bg-white/[0.02] border-white/5 hover:border-white/10 shadow-xl"
                      )}>
                        {isPro && (
                          <div className="absolute top-0 right-0 left-0 h-1 bg-gold-gradient" />
                        )}

                        <CardHeader className="p-10">
                          <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                              "p-4 rounded-2xl shadow-inner",
                              isPro ? "bg-brand-gold/10 text-brand-gold" : "bg-white/5 text-slate-400"
                            )}>
                              {getPlanIcon(plan.name)}
                            </div>
                            {isPro && (
                              <Badge className="bg-brand-gold text-brand-dark font-black text-[9px] uppercase tracking-widest hover:bg-brand-gold border-none">
                                Elite Choice
                              </Badge>
                            )}
                          </div>
                          
                          <CardTitle className="text-2xl font-black tracking-tighter text-white uppercase">
                            {plan.name}
                          </CardTitle>
                          
                          <CardDescription className="flex items-baseline gap-1 pt-4">
                            <span className="text-5xl font-black text-white tracking-tighter">₹{displayPrice}</span>
                            <span className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] ml-2">
                              / {yearly ? 'Year' : 'Month'}
                            </span>
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="px-10 pb-10 flex-1">
                          <ul className="space-y-5">
                            {Array.isArray(plan.features) && plan.features.map((f: string) => (
                              <li key={f} className="flex items-start gap-4 group">
                                <div className={cn(
                                  "h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                                  isPro ? "bg-brand-gold/20" : "bg-white/5"
                                )}>
                                  <Check className={cn("h-3 w-3", isPro ? "text-brand-gold" : "text-slate-500")} />
                                </div>
                                <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>

                        <CardFooter className="p-10 pt-0">
                          <Link to={`/plans/${plan.id}`} className="w-full">
                            <Button 
                              className={cn(
                                "w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300",
                                isPro 
                                  ? "btn-gold shadow-[0_10px_30px_rgba(212,175,55,0.2)]" 
                                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                              )}
                            >
                              {plan.price === 0 ? "Claim Free Access" : "Secure This Tier"}
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
      <SubscriptionExpiredModal open={showExpired} onClose={() => setShowExpired(false)} />
    </MainLayout>
  );
};

export default Pricing;