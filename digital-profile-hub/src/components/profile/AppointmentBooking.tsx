import { useState } from "react";
import { format } from "date-fns";
import { 
  CalendarIcon, Loader2, CheckCircle2, User, Phone, 
  Mail, Clock, ChevronRight, Sparkles 
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
  theme?: "emerald" | "slate";
}

const AppointmentBooking = ({ 
  profileId, 
  customTimeSlots, 
  theme = "emerald" 
}: AppointmentBookingProps) => {
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const themeClasses = {
    emerald: "[--apt-primary:#2D6A4F] [--apt-accent:#40916C] [--apt-bg:#F1F8F6]",
    slate: "[--apt-primary:#1E293B] [--apt-accent:#334155] [--apt-bg:#F8FAFC]",
  };

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
    <section className={cn("w-full py-12 bg-white", themeClasses[theme])}>
      <div className="container mx-auto px-4">
        {/* Simple Section Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-1">
             <CalendarIcon className="h-4 w-4 text-[var(--apt-primary)]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Schedule</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Book Appointment</h2>
          <div className="w-10 h-1 bg-[var(--apt-primary)] mt-1.5 rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {isBooked ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-10 text-center border border-slate-100 shadow-sm"
              >
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Request Sent</h2>
                <p className="text-slate-500 mt-3 text-sm font-medium">
                  We'll contact you for <span className="text-slate-900 font-bold">{slot}</span> on <span className="text-slate-900 font-bold">{date && format(date, "PPP")}</span>.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-8 rounded-xl px-8 border-slate-200 font-bold text-xs"
                  onClick={() => setIsBooked(false)}
                >
                  Schedule Another
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Step 1: Info */}
                <div className="grid grid-cols-1 gap-4">
                   <div className="relative">
                    <User className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                    <Input placeholder="Full Name" className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                      <Input placeholder="Email Address" className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                      <Input placeholder="Phone Number" className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Step 2: Date Picker */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">1. Select Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 justify-between px-4 bg-white">
                            {date ? format(date, "PPP") : "Choose a date"}
                            <CalendarIcon className="h-4 w-4 text-[var(--apt-primary)]" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none shadow-xl rounded-2xl" align="start">
                          <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex-1 space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">2. Select Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.slice(0, 4).map((t) => (
                          <button
                            key={t}
                            onClick={() => setSlot(t)}
                            className={cn(
                              "h-10 rounded-lg text-[10px] font-bold uppercase transition-all border",
                              slot === t 
                                ? "bg-[var(--apt-primary)] border-[var(--apt-primary)] text-white shadow-md" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 bg-[var(--apt-primary)] hover:bg-[var(--apt-accent)] text-white rounded-xl text-sm font-bold shadow-lg transition-all"
                  disabled={loading || !date || !slot || !formData.name}
                  onClick={handleBooking}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <span className="flex items-center gap-2">
                      Confirm Booking <ChevronRight className="h-4 w-4" />
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