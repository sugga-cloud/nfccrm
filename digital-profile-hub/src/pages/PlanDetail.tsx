import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, ShieldCheck, Zap, 
  ArrowLeft, Loader2, AlertCircle, Infinity 
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const { data: plan, isLoading, isError } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await api.get(`/plans/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  const handlePayment = async () => {
    if (!plan) return;
    setProcessing(true);

    try {
      // 1. Create the Order
      const { data: order } = await api.post("/payments/create-order", { 
        plan_id: plan.id 
      });
      
      // 2. Fallback for Simulation (if SDK fails to load)
      if (typeof (window as any).Razorpay === "undefined") {
        toast.info("Razorpay SDK not found. Simulating transaction...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Pass a mock order ID so the backend knows which 'pending' sub to activate
        await api.post("/payments/verify", { 
            plan_id: plan.id, 
            razorpay_order_id: order.id, // Link to the pending sub created in Step 1
            simulation: true 
        });
        
        toast.success(`Welcome to ${plan.name}!`);
        navigate("/dashboard");
        return;
      }

      // 3. Real Razorpay Options
      const options = {
        // Best Practice: Use the key sent by your backend settings
        key: order.razorpay_key || import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: "INR",
        name: "MyWebLink Premium",
        description: `Activation: ${plan.name}`,
        order_id: order.id, // Real Razorpay Order ID
        handler: async (response: any) => {
          try {
            // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
            await api.post("/payments/verify", { 
                ...response, 
                plan_id: plan.id 
            });
            toast.success("Identity Verified! Subscription Active.");
            navigate("/dashboard");
          } catch (err) {
            toast.error("Verification failed. Please contact support.");
          }
        },
        // prefill should ideally come from your Auth user state
        prefill: { 
            name: "Sazid Husain", // Replace with dynamic data
            email: "sazid@example.com" 
        },
        theme: { color: "#D4AF37" }, 
      };

      const rzp = new (window as any).Razorpay(options);
      
      // Handle payment failure (user closes modal or card fails)
      rzp.on('payment.failed', function (response: any){
          toast.error("Payment failed: " + response.error.description);
          console.log(response.error);
      });

      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Initialization failed");
    } finally {
      setProcessing(false);
    }
};
  if (isLoading) return (
    <div className="h-screen bg-brand-dark flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-brand-gold" />
      <p className="font-black uppercase tracking-[0.3em] text-slate-500 text-[10px]">Securing Encrypted Tunnel...</p>
    </div>
  );

  if (isError || !plan) return (
    <div className="h-screen bg-brand-dark flex flex-col items-center justify-center gap-4 text-white">
      <AlertCircle className="h-12 w-12 text-brand-gold" />
      <p className="font-black text-xl uppercase tracking-tighter italic">Tier Not Identified</p>
      <Button variant="outline" className="border-white/10 text-white" onClick={() => navigate(-1)}>Return to Tiers</Button>
    </div>
  );

  return (
    <MainLayout>
      <div className="bg-brand-dark min-h-screen">
        <div className="max-w-6xl mx-auto py-12 px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 gap-2 hover:bg-white/5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] text-slate-500 hover:text-brand-gold transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Plans
          </Button>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: Features */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <Badge className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                  Authorized Selection
                </Badge>
                <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.8] mb-8">
                  Activate <br /> 
                  <span className="text-brand-gold">{plan.name}</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
                  Unlock the full potential of your digital identity with the {plan.name} tier. Engineered for those who demand excellence.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {plan.features?.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 shadow-2xl group transition-all hover:bg-white/[0.05]">
                    <div className="h-10 w-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-slate-300 text-[11px] leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Checkout Summary */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-brand-dark border border-white/10 p-10 rounded-[4rem] text-white shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 blur-[100px] -z-10" />

                <div className="flex justify-between items-start mb-16">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Access Duration</p>
                    <p className="text-3xl font-black italic tracking-tighter uppercase text-brand-gold">{plan.duration} Days</p>
                  </div>
                  <Infinity className="h-8 w-8 text-brand-gold animate-pulse" />
                </div>

                <div className="space-y-6 mb-16">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                    <span className="text-slate-500">Tier Licensing</span>
                    <span className="text-white">₹{(plan.price * 0.82).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                    <span className="text-slate-500">Service Tax (18%)</span>
                    <span className="text-white">₹{(plan.price * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/5 w-full" />
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold mb-1">Total Investment</p>
                      <p className="text-6xl font-black italic tracking-tighter">₹{plan.price}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={processing}
                  className="btn-gold w-full h-20 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs"
                >
                  {processing ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Authorizing...</span>
                    </div>
                  ) : (
                    "Confirm Activation"
                  )}
                </Button>

                <div className="mt-10 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-brand-gold" /> 
                  End-to-End Encrypted
                </div>
              </div>

              {/* Support Note */}
              <p className="mt-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Questions? <span className="text-brand-gold cursor-pointer hover:underline underline-offset-4 transition-all">Connect with Concierge</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PlanDetail;