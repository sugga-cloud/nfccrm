import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, ShieldCheck, Zap, 
  ArrowLeft, Loader2, AlertCircle 
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // --- 1. FETCH PLAN DETAILS WITH CACHE ---
  const { data: plan, isLoading, isError } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await api.get(`/plans/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 30, // Plan details rarely change
  });

  // --- 2. PAYMENT HANDLER ---
  const handlePayment = async () => {
    if (!plan) return;
    setProcessing(true);

    try {
      // Create order on Laravel Backend
      const { data: order } = await api.post("/payments/create-order", { 
        plan_id: plan.id 
      });
      
      // Simulation/Production Logic
      if (typeof (window as any).Razorpay === "undefined") {
        // Fallback for Dev Environment
        toast.info("Razorpay SDK not found. Simulating transaction...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await api.post("/payments/verify", { 
          plan_id: plan.id, 
          simulation: true 
        });
        
        toast.success(`Welcome to ${plan.name}!`);
        navigate("/dashboard");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "NFC Identity",
        description: `Upgrade to ${plan.name}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await api.post("/payments/verify", {
              ...response,
              plan_id: plan.id
            });
            toast.success("Payment Verified! Subscription Active.");
            navigate("/dashboard");
          } catch (err) {
            toast.error("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Member", 
          email: "member@nfc-id.com",
        },
        theme: { color: "#f97316" }, // Orange-500
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.log(err.response.data);
      toast.error(err.response?.data?.message || "Initialization failed");
    } finally {
      setProcessing(false);
    }
  };

  // Loading State
  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      <p className="font-black italic uppercase tracking-tighter text-slate-400">Securing Connection...</p>
    </div>
  );

  // Error State
  if (isError || !plan) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-rose-500" />
      <p className="font-bold text-slate-900 text-xl uppercase italic">Plan not found</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-12 px-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 gap-2 hover:bg-slate-100 rounded-xl font-bold uppercase text-xs tracking-widest text-slate-400 hover:text-slate-900 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Plans
        </Button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Features & Benefits */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <Badge className="bg-orange-500 hover:bg-orange-600 rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px] border-none mb-6">
                Premium Access
              </Badge>
              <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.85]">
                Unlock <br /> 
                <span className="text-orange-500">{plan.name}</span> Power
              </h1>
              <p className="text-slate-500 mt-6 text-xl font-medium max-w-xl">
                Elevate your digital presence with high-performance tools and lifetime node support.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {plan.features?.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="font-black italic uppercase tracking-tighter text-slate-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Checkout Summary */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-slate-900 p-8 md:p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px] -z-10" />

              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Billing Period</p>
                  <p className="text-2xl font-black italic tracking-tighter uppercase">{plan.duration} Days</p>
                </div>
                <Zap className="h-8 w-8 text-orange-500 animate-pulse" />
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Base Subscription</span>
                  <span className="font-bold">₹{(plan.price * 0.82).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">GST (18%)</span>
                  <span className="font-bold">₹{(plan.price * 0.18).toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-800 w-full" />
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Amount Due</p>
                    <p className="text-5xl font-black italic tracking-tighter">₹{plan.price}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-20 rounded-[2rem] bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] active:scale-95"
              >
                {processing ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Initiate Authorization"
                )}
              </Button>

              <div className="mt-8 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> 
                AES-256 Encrypted Payment
              </div>
            </div>

            {/* Support Note */}
            <p className="mt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              Need help? <span className="text-slate-900 cursor-pointer underline">Contact Node Support</span>
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default PlanDetail;