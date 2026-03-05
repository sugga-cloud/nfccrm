import { useState } from "react";
import { format } from "date-fns";
import { 
  CalendarIcon, Loader2, CheckCircle2, User, Phone, 
  Mail, ChevronRight, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import api from "@/api/api";
import { toast } from "sonner";

interface AppointmentBookingProps {
  profileId: number;
  customTimeSlots?: string[];
  theme: any; 
  ui: any;    
}

const AppointmentBooking = ({ 
  profileId, 
  customTimeSlots, 
  theme,
  ui
}: AppointmentBookingProps) => {
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Layout-specific classes mapping
  const layouts = {
    classic: { card: "rounded-none border-2", input: "rounded-none", button: "rounded-none", header: "items-center text-center", container: "max-w-2xl" },
    modern: { card: "rounded-[2.5rem] shadow-2xl", input: "rounded-2xl", button: "rounded-2xl shadow-lg", header: "items-center text-center", container: "max-w-xl" },
    glass: { card: "rounded-[2rem] backdrop-blur-2xl bg-white/5 border-white/20 shadow-none", input: "bg-white/5 border-white/10 rounded-xl", button: "rounded-xl", header: "items-center text-center", container: "max-w-xl" },
    minimal: { card: "rounded-3xl border-none shadow-none bg-secondary/5", input: "rounded-xl bg-secondary/10", button: "rounded-xl", header: "items-start text-left", container: "max-w-full" },
    bento: { card: "rounded-[2rem] border-2 shadow-none", input: "rounded-2xl", button: "rounded-2xl", header: "items-center text-center", container: "max-w-xl" },
  };

  const style = layouts[ui.id as keyof typeof layouts] || layouts.modern;

  const handleBooking = async () => {
    if (!date || !slot || !formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all details");
      return;
    }
    setLoading(true);
    try {
      await api.post("/take-appointment", {
        profile_id: profileId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        appointment_date: format(date, "yyyy-MM-dd"),
        appointment_time: slot,
        status: 'pending'
      });
      setIsBooked(true);
      toast.success("Booking request sent!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("relative w-full py-24 overflow-hidden transition-all duration-500", theme.bg, ui.spacing)}>
      
      {/* 1. Animated Background Blobs (Dynamic for Glass/Modern/Bento) */}
      {ui.id !== "classic" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 100, 0], 
              y: [0, 50, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={cn("absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20", theme.accent)} 
          />
          <motion.div 
            animate={{ 
              x: [0, -80, 0], 
              y: [0, 100, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className={cn("absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20", theme.primary)} 
          />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn("flex flex-col mb-12", style.header)}
        >
          <div className="flex items-center gap-2 mb-3">
             <Sparkles className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>
                Reservations
             </span>
          </div>
          <h2 className={cn("text-3xl font-bold tracking-tighter sm:text-4xl", theme.text)}>
            Secure Your <span className={theme.primary}>Slot</span>
          </h2>
          {ui.id !== "minimal" && (
            <div className={cn("w-16 h-1 mt-4 rounded-full", theme.accent, ui.id === "classic" && "rounded-none")} />
          )}
        </motion.div>

        <div className={cn("mx-auto transition-all duration-700", style.container)}>
          <AnimatePresence mode="wait">
            {isBooked ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className={cn("p-12 text-center border shadow-2xl", theme.card, theme.border, style.card)}
              >
                <div className={cn("mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-8 bg-opacity-10", theme.accent)}>
                  <CheckCircle2 className={cn("h-10 w-10", theme.primary)} />
                </div>
                <h2 className={cn("text-2xl font-bold", theme.text)}>Request Sent!</h2>
                <p className={cn("mt-3 text-sm opacity-60 max-w-xs mx-auto", theme.text)}>We've received your request and will get back to you shortly via email.</p>
                <Button 
                  variant="outline" 
                  className={cn("mt-8 h-12 px-8 uppercase text-[10px] tracking-[0.2em] font-black", style.button, theme.border, theme.text)}
                  onClick={() => setIsBooked(false)}
                >
                  Book Another
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="form" 
                initial={{ opacity: 0, x: ui.id === "minimal" ? -20 : 0, y: ui.id === "minimal" ? 0 : 20 }} 
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* 2. Personal Details Bento Tile */}
                <div className={cn("p-6 md:p-8 border shadow-xl transition-all", theme.card, theme.border, style.card)}>
                  <div className="grid gap-5">
                    <div className="relative">
                      <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30", theme.text)} />
                      <Input 
                        placeholder="Full Name" 
                        className={cn("pl-12 h-14 border-none ring-1 ring-inset ring-black/5 focus-visible:ring-2", theme.bg, theme.text, style.input)} 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      />
                    </div>
                    <div className={cn("grid gap-5", ui.id === "minimal" ? "grid-cols-1" : "md:grid-cols-2")}>
                      <div className="relative">
                        <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30", theme.text)} />
                        <Input 
                          placeholder="Email" 
                          className={cn("pl-12 h-14 border-none ring-1 ring-inset ring-black/5", theme.bg, theme.text, style.input)} 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                      </div>
                      <div className="relative">
                        <Phone className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30", theme.text)} />
                        <Input 
                          placeholder="Phone" 
                          className={cn("pl-12 h-14 border-none ring-1 ring-inset ring-black/5", theme.bg, theme.text, style.input)} 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. DateTime Selection Bento Tile */}
                <div className={cn("p-6 md:p-8 border shadow-xl", theme.card, theme.border, style.card)}>
                  <div className={cn("grid gap-8", ui.id === "minimal" ? "grid-cols-1" : "md:grid-cols-2")}>
                    <div className="space-y-3">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-40 ml-1", theme.text)}>Step 1: Pick Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-14 justify-between border-none ring-1 ring-inset ring-black/5 px-4", theme.bg, theme.text, style.input)}>
                            <span className="flex items-center gap-3">
                              <CalendarIcon className={cn("h-4 w-4 opacity-40", theme.primary)} />
                              {date ? format(date, "PPP") : "Choose Date"}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-20" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none shadow-2xl" align="start">
                          <Calendar 
                            mode="single" 
                            selected={date} 
                            onSelect={setDate} 
                            disabled={(d) => d < new Date()} 
                            className={cn(theme.card, theme.text, "rounded-2xl p-4")} 
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-40 ml-1", theme.text)}>Step 2: Pick Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(customTimeSlots || ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]).map((t) => (
                          <button
                            key={t}
                            onClick={() => setSlot(t)}
                            className={cn(
                              "h-14 rounded-xl text-[10px] font-bold transition-all border-2",
                              style.input,
                              slot === t 
                                ? cn(theme.accent, theme.accentContent, "border-transparent scale-[0.98]") 
                                : cn(theme.bg, theme.border, theme.text, "opacity-60 hover:opacity-100")
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Submit Action */}
                <Button 
                  className={cn(
                    "w-full h-16 text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 hover:brightness-110", 
                    theme.accent, theme.accentContent, style.button
                  )}
                  disabled={loading || !date || !slot || !formData.name}
                  onClick={handleBooking}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Reservation"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AppointmentBooking;