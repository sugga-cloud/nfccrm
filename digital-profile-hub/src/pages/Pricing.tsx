import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Add this
import { Check, Sparkles, Zap, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge"; // Fix: Import from your components
import MainLayout from "@/components/layout/MainLayout";
import SubscriptionExpiredModal from "@/components/SubscriptionExpiredModal";
import api from "@/api/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const getPlanIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("pro")) return <Zap className="h-5 w-5 text-orange-500" />;
  if (n.includes("business") || n.includes("corp")) return <Crown className="h-5 w-5 text-purple-500" />;
  return <Sparkles className="h-5 w-5 text-blue-500" />;
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
      <section className="container py-20 min-h-screen">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest"
          >
            <Zap className="h-3 w-3 fill-orange-500" /> Subscription Tiers
          </motion.div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900">
            Scale Your <span className="text-orange-500">Identity</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Choose a plan that fits your business size. Upgrade anytime.
          </p>

          <div className="pt-8 flex items-center justify-center gap-4">
            <span className={cn("text-sm font-bold transition-colors", !yearly ? "text-slate-900" : "text-slate-400")}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} className="data-[state=checked]:bg-orange-500" />
            <span className={cn("text-sm font-bold transition-colors", yearly ? "text-slate-900" : "text-slate-400")}>
              Yearly <span className="text-orange-500 font-black text-[10px] bg-orange-50 px-2 py-0.5 rounded-md ml-1">SAVE ~17%</span>
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 items-start">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Tiers...</p>
            </div>
          ) : (
            <AnimatePresence>
              {plans.map((plan, idx) => {
                const isPro = plan.name.toLowerCase().includes("pro");
                const displayPrice = yearly ? Math.floor(plan.price * 10) : plan.price;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={cn(
                      "relative flex flex-col h-full rounded-[2.5rem] transition-all duration-300 border-slate-100",
                      isPro ? "border-orange-200 shadow-2xl scale-105 z-10 bg-white" : "hover:border-slate-300 bg-slate-50/50 shadow-sm"
                    )}>
                      {isPro && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                          Most Popular
                        </div>
                      )}

                      <CardHeader className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white rounded-2xl shadow-sm">
                            {getPlanIcon(plan.name)}
                          </div>
                          <Badge variant="outline" className="border-slate-200 font-bold uppercase tracking-widest text-[9px]">
                            {plan.duration} Days
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="flex items-baseline gap-1 pt-2">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{displayPrice}</span>
                          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                            / {yearly ? 'Year' : 'Month'}
                          </span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="px-8 pb-8 flex-1">
                        <ul className="space-y-4">
                          {Array.isArray(plan.features) && plan.features.map((f: string) => (
                            <li key={f} className="flex items-start gap-3 group">
                              <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-3 w-3 text-emerald-600" />
                              </div>
                              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>

                      <CardFooter className="p-8 pt-0">
                        {/* THE REDIRECT LINK */}
                        <Link to={`/plans/${plan.id}`} className="w-full">
                          <Button 
                            className={cn(
                              "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl",
                              isPro ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200" : "bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 shadow-slate-100"
                            )}
                          >
                            {plan.price === 0 ? "Get Started" : "Select Plan"}
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
      </section>
      <SubscriptionExpiredModal open={showExpired} onClose={() => setShowExpired(false)} />
    </MainLayout>
  );
};

export default Pricing;