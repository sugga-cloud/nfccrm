import { useState } from "react";
import api from "@/api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, UserCog } from "lucide-react";

const CreateStaff = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/staff", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });

      toast.success("Staff user created with role 3 (staff).");
      setForm({
        full_name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create staff user.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-6">
      <Card className="bg-white/5 border border-white/10 shadow-none rounded-3xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <UserCog className="h-4 w-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Staff Management
            </span>
          </div>
          <CardTitle className="text-xl font-black italic tracking-tighter uppercase text-white">
            Create Staff Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Full Name
              </label>
              <Input
                name="full_name"
                placeholder="Staff Name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="staff@example.com"
                  className="pl-9"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    name="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                className="bg-brand-gold hover:bg-brand-accent text-brand-dark font-black uppercase tracking-widest rounded-xl px-6"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Staff"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStaff;

