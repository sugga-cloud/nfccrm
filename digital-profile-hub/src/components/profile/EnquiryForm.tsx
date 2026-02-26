import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, User, Phone, Mail, MessageSquare } from "lucide-react";
import api from "@/api/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EnquiryFormProps {
  profileId: number;
  theme?: "emerald" | "slate";
}

const EnquiryForm = ({ profileId, theme = "emerald" }: EnquiryFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const themeClasses = {
    emerald: "[--form-primary:#1B4332] [--form-accent:#2D6A4F] [--form-bg:#F1F8F6]",
    slate: "[--form-primary:#0F172A] [--form-accent:#334155] [--form-bg:#F8FAFC]",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/enquire", {
        profile_id: profileId,
        ...formData,
      });
      toast.success("Enquiry sent successfully!");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="enquiry" className={cn("w-full py-12 bg-white", themeClasses[theme])}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-2 mb-1">
             <MessageSquare className="h-4 w-4 text-[var(--form-accent)]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Contact Us</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Send an Enquiry</h2>
          <div className="w-10 h-1 bg-[var(--form-accent)] mt-1.5 rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl"
        >
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-6 md:p-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Name Field */}
              <div className="space-y-1.5">
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium text-sm"
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              {/* Grid for Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium text-sm"
                    placeholder="Phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium text-sm"
                    placeholder="Email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <Textarea 
                  className="rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium p-4 text-sm resize-none"
                  placeholder="How can we help you?" 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <Button 
                className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-md group" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Enquiry
                    <Send className="h-3.5 w-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[var(--form-accent)]" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnquiryForm;