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
  theme: any; 
  ui: any;    
}

const EnquiryForm = ({ profileId, theme, ui }: EnquiryFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

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

  // Improved Input styling for theme consistency
  const inputClasses = cn(
    "pl-11 h-12 transition-all font-medium text-sm border bg-opacity-50",
    ui.layout === "minimal" ? "rounded-xl" : "rounded-2xl",
    theme.card, 
    theme.border, 
    theme.text, 
    "placeholder:opacity-30",
    "focus:ring-2 focus:ring-offset-2 ring-offset-transparent outline-none",
    // Logic to handle focus ring color safely
    theme.name === "Pure Dark" ? "focus:ring-zinc-400" : "focus:ring-primary"
  );

  return (
    <section id="enquiry" className={cn("w-full py-20 transition-colors duration-500", theme.bg)}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className={cn(
          "flex flex-col mb-12",
          ui.layout === "minimal" ? "items-start text-left" : "items-center text-center"
        )}>
          <div className="flex items-center gap-2 mb-2">
             <MessageSquare className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>
               Get In Touch
             </span>
          </div>
          <h2 className={cn("text-3xl font-black italic uppercase tracking-tighter", theme.text)}>
            Send an Enquiry
          </h2>
          <div className={cn("w-16 h-1.5 mt-3 rounded-full", theme.accent)} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <div className={cn(
            "relative border shadow-2xl overflow-hidden p-8 md:p-12 transition-all duration-500",
            theme.card,
            theme.border,
            ui.layout === "minimal" ? "rounded-3xl" : "rounded-[3.5rem]"
          )}>
            {/* Decorative background glow */}
            <div className={cn("absolute -top-24 -right-24 w-48 h-48 opacity-10 blur-3xl rounded-full", theme.accent)} />

            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              
              {/* Name Field */}
              <div className="relative group">
                <User className={cn("absolute left-4 top-3.5 h-4 w-4 transition-opacity duration-300 opacity-30 group-focus-within:opacity-100", theme.text)} />
                <Input 
                  className={inputClasses}
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Grid for Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <Phone className={cn("absolute left-4 top-3.5 h-4 w-4 transition-opacity duration-300 opacity-30 group-focus-within:opacity-100", theme.text)} />
                  <Input 
                    className={inputClasses}
                    placeholder="Mobile Number" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <Mail className={cn("absolute left-4 top-3.5 h-4 w-4 transition-opacity duration-300 opacity-30 group-focus-within:opacity-100", theme.text)} />
                  <Input 
                    className={inputClasses}
                    placeholder="Email Address" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="relative group">
                <Textarea 
                  className={cn(
                    inputClasses,
                    "h-auto p-5 resize-none min-h-[140px] pl-5" // Removed icon padding for textarea for better UX
                  )}
                  placeholder="What's on your mind?..." 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <Button 
                className={cn(
                  "w-full h-14 font-black uppercase tracking-widest text-xs transition-all shadow-2xl group active:scale-95",
                  theme.accent,
                  theme.accentContent || "text-white", // Critical fix for Pure Dark
                  ui.layout === "minimal" ? "rounded-xl" : "rounded-2xl"
                )} 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-3">
                    Submit Message
                    <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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