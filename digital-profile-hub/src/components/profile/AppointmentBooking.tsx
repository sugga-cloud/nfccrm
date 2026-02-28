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

  const availableSlots = customTimeSlots || [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

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
    <section className={cn("w-full py-16 transition-colors duration-500", theme.bg)}>
      <div className="container mx-auto px-4">
        
        {/* Section Header - Respects UI Layout */}
        <div className={cn(
          "flex flex-col mb-10",
          ui.layout === "minimal" ? "items-start text-left" : "items-center text-center"
        )}>
          <div className="flex items-center gap-2 mb-2">
             <Sparkles className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-bold uppercase tracking-[0.3em] opacity-50", theme.text)}>
               Reservations
             </span>
          </div>
          <h2 className={cn("text-2xl font-black italic uppercase tracking-tighter", theme.text)}>
            Book an <span className={theme.primary}>Appointment</span>
          </h2>
          <div className={cn("w-12 h-1 mt-2 rounded-full", theme.accent)} />
        </div>

        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {isBooked ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "p-10 text-center border shadow-2xl transition-all",
                  theme.card, theme.border, 
                  ui.layout === "minimal" ? "rounded-2xl" : "rounded-[3rem]"
                )}
              >
                <div className={cn(
                  "mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6", 
                  theme.accent, "bg-opacity-20"
                )}>
                  <CheckCircle2 className={cn("h-10 w-10", theme.name === "Pure Dark" ? "text-white" : theme.primary.replace('text-', 'text-'))} />
                </div>
                <h2 className={cn("text-2xl font-bold tracking-tight", theme.text)}>Request Received</h2>
                <p className={cn("mt-4 text-sm opacity-60 leading-relaxed", theme.text)}>
                  We'll confirm your slot for <span className="font-bold opacity-100">{slot}</span> on <span className="font-bold opacity-100">{date && format(date, "PPP")}</span> shortly.
                </p>
                <Button 
                  variant="outline" 
                  className={cn("mt-8 rounded-xl px-8 font-bold text-xs uppercase tracking-widest", theme.border, theme.text)}
                  onClick={() => setIsBooked(false)}
                >
                  Schedule Another
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Step 1: Client Info */}
                <div className={cn(
                  "p-6 border shadow-sm space-y-4", 
                  theme.card, theme.border,
                  ui.layout === "minimal" ? "rounded-2xl" : "rounded-[2.5rem]"
                )}>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest opacity-40 mb-2", theme.text)}>Contact Information</p>
                  
                  <div className="relative">
                    <User className={cn("absolute left-4 top-3.5 h-4 w-4 opacity-40", theme.text)} />
                    <Input 
                      placeholder="Your Full Name" 
                      className={cn(
                        "pl-11 h-12 rounded-xl border-none ring-1 ring-inset focus-visible:ring-2 transition-all", 
                        theme.bg, theme.text, "ring-white/10"
                      )} 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Mail className={cn("absolute left-4 top-3.5 h-4 w-4 opacity-40", theme.text)} />
                      <Input 
                        placeholder="Email Address" 
                        className={cn("pl-11 h-12 rounded-xl border-none ring-1 ring-inset", theme.bg, theme.text, "ring-white/10")} 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      />
                    </div>
                    <div className="relative">
                      <Phone className={cn("absolute left-4 top-3.5 h-4 w-4 opacity-40", theme.text)} />
                      <Input 
                        placeholder="Phone Number" 
                        className={cn("pl-11 h-12 rounded-xl border-none ring-1 ring-inset", theme.bg, theme.text, "ring-white/10")} 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Date & Time Select */}
                <div className={cn(
                  "p-6 border shadow-sm space-y-6", 
                  theme.card, theme.border,
                  ui.layout === "minimal" ? "rounded-2xl" : "rounded-[2.5rem]"
                )}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-40", theme.text)}>1. Pick Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-12 rounded-xl justify-between px-4 border-none ring-1 ring-inset ring-white/10", theme.bg, theme.text)}>
                            {date ? format(date, "MMM dd, yyyy") : "Select Date"}
                            <CalendarIcon className={cn("h-4 w-4 opacity-50", theme.primary)} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start">
                          <Calendar 
                            mode="single" 
                            selected={date} 
                            onSelect={setDate} 
                            disabled={(d) => d < new Date()}
                            className={cn(theme.card, theme.text)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-40", theme.text)}>2. Pick Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.slice(0, 4).map((t) => (
                          <button
                            key={t}
                            onClick={() => setSlot(t)}
                            className={cn(
                              "h-10 rounded-lg text-[10px] font-bold uppercase transition-all border",
                              slot === t 
                                ? cn(theme.accent, theme.accentContent, "border-transparent shadow-lg scale-105") 
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

                {/* Main Action Button - Uses accentContent for Pure Dark fix */}
                <Button 
                  className={cn(
                    "w-full h-16 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]",
                    theme.accent, 
                    theme.accentContent, // <--- This fixes the invisible text/icon issue
                    "hover:brightness-110"
                  )}
                  disabled={loading || !date || !slot || !formData.name}
                  onClick={handleBooking}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <span className="flex items-center gap-3">
                      Confirm Appointment <ChevronRight className="h-5 w-5" />
                    </span>
                  )}
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