import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, UserPlus, Mail, Lock, Shield, UserCheck } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Register = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/register", form);
      
      let userRole: "admin" | "customer" | "staff";
      if (response.data.user.role_id === 1) {
        userRole = "admin";
      } else if (response.data.user.role_id === 3) {
        userRole = "staff";
      } else {
        userRole = "customer";
      }

      localStorage.setItem("token", response.data.token);
      setRole(userRole);

      toast.success("Welcome to the elite tier.");
      navigate(userRole === "admin" ? "/admin" : "/dashboard");
      
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-[90vh] items-center justify-center px-4 bg-brand-dark relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] pointer-events-none" />
        
        <Card className="w-full max-w-lg border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl rounded-[3rem] overflow-hidden relative z-10">
          <CardHeader className="text-center pt-12 pb-8">
            <div className="mx-auto bg-brand-gold/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border border-brand-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
               <UserPlus className="text-brand-gold h-8 w-8" />
            </div>
            <CardTitle className="text-4xl font-black tracking-tighter uppercase text-white">
              Claim <span className="text-brand-gold italic font-serif lowercase tracking-normal px-1">identity</span>
            </CardTitle>
            <CardDescription className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
              Executive Registration
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-10 space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-red-500/20 text-center animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Full Legal Name</label>
                <div className="relative group">
                  <UserCheck className="absolute left-4 top-4 h-4 w-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                  <Input
                    name="full_name"
                    placeholder="Sazid Husain"
                    className="pl-12 h-14 rounded-2xl bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-brand-gold/50 focus-visible:bg-white/[0.08] transition-all"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Digital ID (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@myweblink.com"
                    className="pl-12 h-14 rounded-2xl bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-brand-gold/50 focus-visible:bg-white/[0.08] transition-all"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••"
                      className="pl-12 h-14 rounded-2xl bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-brand-gold/50 transition-all"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Confirm</label>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-4 h-4 w-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                    <Input
                      name="password_confirmation"
                      type="password"
                      placeholder="••••"
                      className="pl-12 h-14 rounded-2xl bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-brand-gold/50 transition-all"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 btn-gold rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs mt-4 shadow-[0_20px_40px_rgba(212,175,55,0.1)] hover:scale-[1.02] active:scale-95 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Establish Profile"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-white/[0.03] p-10 flex flex-col gap-4 justify-center border-t border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center">
              Already possess an identity?{" "}
              <Link to="/login" className="text-brand-gold hover:text-white underline underline-offset-4 transition-colors">
                Authorize Here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Register;