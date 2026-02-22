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
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose";
}

const AppointmentBooking = ({ 
  profileId, 
  customTimeSlots, 
  theme = "orange" 
}: AppointmentBookingProps) => {
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const themeClasses = {
    orange: "[--apt-primary:#f97316] [--apt-bg:theme(colors.orange.50)]",
    blue: "[--apt-primary:#3b82f6] [--apt-bg:theme(colors.blue.50)]",
    purple: "[--apt-primary:#a855f7] [--apt-bg:theme(colors.purple.50)]",
    emerald: "[--apt-primary:#10b981] [--apt-bg:theme(colors.emerald.50)]",
    rose: "[--apt-primary:#f43f5e] [--apt-bg:theme(colors.rose.50)]",
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
      console.log(error.response.data)
      toast.error(error.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("w-full py-16 px-4 md:px-6", themeClasses[theme])}>
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {isBooked ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-10 text-center shadow-2xl border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[var(--apt-primary)]" />
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Request Sent</h2>
              <p className="text-slate-500 mt-4 max-w-xs mx-auto font-medium">
                We've received your request for <span className="text-slate-900 font-bold">{slot}</span> on <span className="text-slate-900 font-bold">{date && format(date, "PPP")}</span>.
              </p>
              <Button 
                variant="outline" 
                className="mt-8 h-12 rounded-2xl px-8 border-slate-200 font-bold uppercase tracking-widest text-[10px]"
                onClick={() => setIsBooked(false)}
              >
                Schedule Another
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-50"
            >
              {/* Header */}
              <div className="bg-slate-900 p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <Sparkles className="h-4 w-4 text-[var(--apt-primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Booking</span>
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Reserve <span className="text-[var(--apt-primary)]">Time</span></h2>
                </div>
                <Clock className="h-12 w-12 text-white/10 hidden md:block" />
              </div>

              <div className="p-8 md:p-12 space-y-8">
                {/* Step 1: Personal Details */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">1. Your Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <Input placeholder="Full Name" className="pl-11 h-12 rounded-2xl bg-slate-50 border-none font-medium" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <Input placeholder="Email" className="pl-11 h-12 rounded-2xl bg-slate-50 border-none font-medium" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <Input placeholder="Phone" className="pl-11 h-12 rounded-2xl bg-slate-50 border-none font-medium" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Step 2: Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">2. Select Date</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-100 hover:border-[var(--apt-primary)] justify-between px-6 text-lg font-bold italic tracking-tight">
                          {date ? format(date, "MMM dd, yyyy") : "Choose Date"}
                          <CalendarIcon className="h-5 w-5 text-[var(--apt-primary)]" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">3. Select Slot</p>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSlot(t)}
                          className={cn(
                            "h-12 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border-2",
                            slot === t 
                              ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                              : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-16 bg-[var(--apt-primary)] hover:opacity-90 text-white rounded-2xl text-lg font-black italic uppercase tracking-tighter shadow-xl shadow-[var(--apt-primary)]/20 group"
                  disabled={loading || !date || !slot || !formData.name}
                  onClick={handleBooking}
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <span className="flex items-center gap-2">
                      Confirm Appointment <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AppointmentBooking;