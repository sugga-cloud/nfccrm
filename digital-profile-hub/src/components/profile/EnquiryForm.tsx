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

  // Layout-specific configurations
  const layouts = {
    classic: { card: "rounded-none", input: "rounded-none", button: "rounded-none", glass: "" },
    modern: { card: "rounded-[3rem]", input: "rounded-2xl", button: "rounded-2xl", glass: "" },
    glass: { card: "rounded-[2rem] backdrop-blur-xl bg-white/10 border-white/20 shadow-none", input: "rounded-xl bg-white/5 border-white/10 backdrop-blur-md", button: "rounded-xl", glass: "backdrop-blur-md" },
    minimal: { card: "rounded-3xl border-none shadow-none bg-transparent p-0", input: "rounded-xl bg-secondary/10 border-none", button: "rounded-xl", glass: "" },
    bento: { card: "rounded-[2.5rem]", input: "rounded-2xl", button: "rounded-2xl", glass: "" },
  };

  const style = layouts[ui.id as keyof typeof layouts] || layouts.modern;

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

  const inputClasses = cn(
    "pl-11 h-12 transition-all font-medium text-sm border",
    style.input,
    ui.id !== "minimal" ? theme.card : "",
    theme.border,
    theme.text,
    "placeholder:opacity-30 focus:ring-2 focus:ring-offset-2 ring-offset-transparent outline-none",
    theme.name === "Pure Dark" ? "focus:ring-zinc-400" : "focus:ring-primary"
  );

  return (
    <section id="enquiry" className={cn("w-full py-12 transition-all duration-500", theme.bg, ui.spacing)}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className={cn(
          "flex flex-col mb-10",
          ui.id === "minimal" ? "items-start text-left" : "items-center text-center"
        )}>
          <div className="flex items-center gap-2 mb-2">
             <MessageSquare className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-50", theme.text)}>
                Get In Touch
             </span>
          </div>
          <h2 className={cn("text-2xl font-bold tracking-tight", theme.text)}>
            Send an Enquiry
          </h2>
          {ui.id !== "minimal" && <div className={cn("w-12 h-1 mt-3 rounded-full", theme.accent)} />}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <div className={cn(
            "relative border transition-all duration-500",
            ui.id !== "minimal" && "p-8 md:p-10 shadow-2xl",
            theme.card, theme.border, style.card
          )}>
            {/* Background decorative element - hidden on minimal */}
            {ui.id !== "minimal" && (
              <div className={cn("absolute -top-20 -right-20 w-40 h-40 opacity-10 blur-3xl rounded-full", theme.accent)} />
            )}

            <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
              <div className="relative group">
                <User className={cn("absolute left-4 top-3.5 h-4 w-4 opacity-30 group-focus-within:opacity-100 transition-opacity", theme.text)} />
                <Input 
                  className={inputClasses}
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className={cn("grid gap-5", ui.id === "bento" ? "grid-cols-1" : "md:grid-cols-2")}>
                <div className="relative group">
                  <Phone className={cn("absolute left-4 top-3.5 h-4 w-4 opacity-30 group-focus-within:opacity-100 transition-opacity", theme.text)} />
                  <Input 
                    className={inputClasses}
                    placeholder="Mobile Number" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <Mail className={cn("absolute left-4 top-3.5 h-4 w-4 opacity-30 group-focus-within:opacity-100 transition-opacity", theme.text)} />
                  <Input 
                    className={inputClasses}
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="relative group">
                <Textarea 
                  className={cn(inputClasses, "h-auto p-4 resize-none min-h-[120px] pl-4")}
                  placeholder="How can we help you?..." 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <Button 
                className={cn(
                  "w-full h-14 font-bold uppercase tracking-widest text-[10px] transition-all group active:scale-[0.98]",
                  theme.accent, theme.accentContent || "text-white",
                  style.button,
                  ui.id !== "minimal" && "shadow-xl"
                )} 
                type="submit" 
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <span className="flex items-center gap-2">
                    Submit Message <Send className="h-3.5 w-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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