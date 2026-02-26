import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessHourRow {
  day: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

interface BusinessHoursProps {
  data: BusinessHourRow[] | null;
  theme?: "emerald" | "slate";
}

// Helper to get the current weekday name
const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

const BusinessHours = ({ data, theme = "emerald" }: BusinessHoursProps) => {
  if (!data || data.length === 0) return null;

  const themeClasses = {
    emerald: "[--hr-accent:#2D6A4F] [--hr-light:#D8F3DC]",
    slate: "[--hr-accent:#334155] [--hr-light:#F1F5F9]",
  };

  const formatTime = (time: string | null) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <section className={cn("w-full py-12 bg-white", themeClasses[theme])}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
             <Clock className="h-4 w-4 text-[var(--hr-accent)]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Schedule</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Business Hours</h2>
          <div className="w-10 h-1 bg-[var(--hr-accent)] mt-1.5 rounded-full" />
        </motion.div>

        {/* Clean Row List */}
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {data.map((row, index) => {
            const isToday = row.day === today;
            const isOpen = !row.is_closed;

            return (
              <div
                key={row.day}
                className={cn(
                  "flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-none transition-colors",
                  isToday ? "bg-[var(--hr-light)]/30" : "hover:bg-slate-50/50"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Small Indicator for Today */}
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isToday ? "bg-[var(--hr-accent)] animate-pulse" : "bg-transparent"
                  )} />
                  
                  <span className={cn(
                    "text-sm font-bold",
                    isToday ? "text-slate-900" : "text-slate-600"
                  )}>
                    {row.day}
                  </span>
                </div>

                <div className="text-right">
                  {isOpen ? (
                    <p className="text-xs font-semibold text-slate-800 tracking-tight">
                      {formatTime(row.open_time)} <span className="mx-1 text-slate-300 font-normal">to</span> {formatTime(row.close_time)}
                    </p>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
                      Closed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessHours;