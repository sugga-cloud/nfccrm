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
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose";
}

const EnquiryForm = ({ profileId, theme = "orange" }: EnquiryFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const themeClasses = {
    orange: "[--form-primary:#f97316] [--form-bg:theme(colors.orange.50)]",
    blue: "[--form-primary:#3b82f6] [--form-bg:theme(colors.blue.50)]",
    purple: "[--form-primary:#a855f7] [--form-bg:theme(colors.purple.50)]",
    emerald: "[--form-primary:#10b981] [--form-bg:theme(colors.emerald.50)]",
    rose: "[--form-primary:#f43f5e] [--form-bg:theme(colors.rose.50)]",
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
      console.log(error.response.data.message)
      toast.error(error.response?.data?.message || "Failed to send enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("container py-16 px-4", themeClasses[theme])}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-2xl"
      >
        {/* Background Stack Decor */}
        <div className="absolute inset-0 translate-x-4 translate-y-4 bg-[var(--form-primary)]/10 rounded-[3rem] -z-10" />
        
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-slate-900 p-8 text-center text-white">
            <div className="mx-auto bg-[var(--form-primary)] w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <MessageSquare className="text-white h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">
              Get In <span className="text-[var(--form-primary)]">Touch</span>
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
              Have questions? Send a message
            </p>
          </div>

          <form className="p-8 md:p-12 space-y-6" id="enquiry-section" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  className="pl-11 h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[var(--form-primary)] font-medium"
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Contact Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-11 h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[var(--form-primary)] font-medium"
                    placeholder="+1 234..." 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-11 h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[var(--form-primary)] font-medium"
                    placeholder="john@example.com" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
              <Textarea 
                className="rounded-[2rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[var(--form-primary)] font-medium p-5"
                placeholder="How can we help you?" 
                rows={4} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <Button 
              className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4 text-[var(--form-primary)]" />
                  Submit Enquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default EnquiryForm;