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
import { Loader2, LogIn, Mail, Lock } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";

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
    e.preventDefault(); // Prevent standard form submission
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/login", form);
      const { token, user } = response.data;

      // 1. Logic to determine role (Match your DB logic)
      const userRole = user.role_id === 1 ? "admin" : "customer";

      // 2. Critical: Set storage FIRST
      localStorage.setItem("token", token);

      // 3. Update Context SECOND
      setRole(userRole);

      toast.success("Welcome back!");

      // 4. Navigate based on role
      if (userRole === "admin") {
        navigate("/admin");
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
      <div className="flex min-h-[85vh] items-center justify-center px-4 bg-[#fafafa]">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden">
          {/* Premium Dark Header */}
          <CardHeader className="text-center bg-slate-900 text-white py-10">
            <div className="mx-auto bg-[#f97316] w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <LogIn className="text-white h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-black italic tracking-tighter uppercase">
              Welcome <span className="text-[#f97316]">Back</span>
            </CardTitle>
            <CardDescription className="text-slate-400 font-medium">
              Enter your credentials to access your console
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase text-[#f97316] hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#f97316] hover:bg-black text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-100 mt-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50 p-6 flex justify-center border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              New to NFC Profile?{" "}
              <Link to="/register" className="text-[#f97316] hover:text-black underline transition-colors">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;