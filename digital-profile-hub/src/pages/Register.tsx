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
import { Loader2, UserPlus, Mail, Lock, Shield } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";

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
    e.preventDefault(); // Prevents page reload
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/register", form);
      
      // 1. Determine Role (assuming role_id 1=Admin, 2=Customer)
      const userRole = response.data.user.role_id === 1 ? "admin" : "customer";

      // 2. Persist to LocalStorage (Crucial for refresh)
      localStorage.setItem("token", response.data.token);
      // localStorage.setItem("role", userRole);

      // 3. Update Global Context
      setRole(userRole);

      toast.success("Account created successfully!");

      // 4. Redirect based on role
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
      <div className="flex min-h-[85vh] items-center justify-center px-4 bg-[#fafafa]">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center bg-slate-900 text-white py-8">
            <div className="mx-auto bg-[#f97316] w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
               <UserPlus className="text-white h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-black italic tracking-tighter uppercase">Join Us</CardTitle>
            <CardDescription className="text-slate-400 font-medium">
              Create your premium NFC Profile today
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    name="full_name"
                    placeholder="John Doe"
                    className="pl-11 h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#f97316] font-medium"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-11 h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#f97316] font-medium"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••"
                      className="pl-11 h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      name="password_confirmation"
                      type="password"
                      placeholder="••••"
                      className="pl-11 h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#f97316] hover:bg-black text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-100 mt-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50 p-6 flex justify-center border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Already a member?{" "}
              <Link to="/login" className="text-[#f97316] hover:text-black underline transition-colors">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Register;