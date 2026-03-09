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
import { Loader2, LogIn, Mail, Lock, ShieldCheck } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const response = await api.post("/login", form);
      const { token, user } = response.data;

      let userRole: "admin" | "customer" | "staff";
      if (user.role_id === 1) {
        userRole = "admin";
      } else if (user.role_id === 3) {
        userRole = "staff";
      } else {
        userRole = "customer";
      }

      localStorage.setItem("token", token);
      setRole(userRole);

      toast.success("Identity Verified. Welcome back.");

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "staff") {
        navigate("/staff");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-[90vh] items-center justify-center px-4 bg-brand-dark relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[140px] pointer-events-none" />

        <Card className="w-full max-w-md border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl rounded-[3rem] overflow-hidden relative z-10">
          
          <CardHeader className="text-center pt-12 pb-8">
            <div className="mx-auto bg-brand-gold/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border border-brand-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <ShieldCheck className="text-brand-gold h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter uppercase text-white">
              Secure <span className="text-brand-gold italic font-serif lowercase tracking-normal px-1">console</span>
            </CardTitle>
            <CardDescription className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
              Authentication Required
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-10 space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Digital ID / Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="executive@myweblink.com"
                    className="pl-12 h-14 rounded-2xl bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-brand-gold/50 focus-visible:bg-white/[0.08] transition-all"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Security Key</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white transition-colors">
                    Reset
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-brand-gold/50 focus-visible:bg-white/[0.08] transition-all"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 btn-gold rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all mt-4"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Authorize Access"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-white/[0.03] p-8 flex flex-col gap-4 justify-center border-t border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
              Identity Not Found?{" "}
              <Link to="/register" className="text-brand-gold hover:text-white underline underline-offset-4 transition-colors">
                Register Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;