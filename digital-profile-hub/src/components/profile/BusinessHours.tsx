import { motion } from "framer-motion";
import { Clock, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessHourRow {
  day: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

interface BusinessHoursProps {
  data: BusinessHourRow[] | null;
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose";
}

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

const BusinessHours = ({ data, theme = "orange" }: BusinessHoursProps) => {
  if (!data || data.length === 0) return null;

  const themeClasses = {
    orange: "[--hr-primary:#f97316] [--hr-bg:theme(colors.orange.50)]",
    blue: "[--hr-primary:#3b82f6] [--hr-bg:theme(colors.blue.50)]",
    purple: "[--hr-primary:#a855f7] [--hr-bg:theme(colors.purple.50)]",
    emerald: "[--hr-primary:#10b981] [--hr-bg:theme(colors.emerald.50)]",
    rose: "[--hr-primary:#f43f5e] [--hr-bg:theme(colors.rose.50)]",
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
    <section className={cn("w-full py-16 px-4 md:px-6", themeClasses[theme])}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto flex flex-col items-center mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
           <Clock className="h-4 w-4 text-[var(--hr-primary)]" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Availability</p>
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
          Business <span className="text-[var(--hr-primary)]">Hours</span>
        </h2>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-3">
        {data.map((row, index) => {
          const isToday = row.day === today;
          const isOpen = !row.is_closed;

          return (
            <motion.div
              key={row.day}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "relative flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300",
                isToday 
                  ? "bg-slate-900 text-white shadow-xl scale-[1.02] z-10" 
                  : "bg-white border border-slate-100 text-slate-600 hover:border-[var(--hr-primary)]"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  isToday ? "bg-[var(--hr-primary)]" : "bg-slate-50"
                )}>
                  <Calendar className={cn("h-5 w-5", isToday ? "text-white" : "text-slate-400")} />
                </div>
                <div>
                  <h3 className={cn("text-sm font-black uppercase tracking-tight", isToday ? "text-white" : "text-slate-900")}>
                    {row.day}
                    {isToday && <span className="ml-2 text-[10px] text-[var(--hr-primary)] animate-pulse">● Today</span>}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  {isOpen ? (
                    <p className={cn("text-sm font-bold italic", isToday ? "text-slate-300" : "text-slate-500")}>
                      {formatTime(row.open_time)} <span className="mx-1 opacity-50">–</span> {formatTime(row.close_time)}
                    </p>
                  ) : (
                    <p className="text-sm font-bold uppercase tracking-widest text-red-500 italic opacity-80">Closed</p>
                  )}
                </div>
                {!isToday && <ChevronRight className="h-4 w-4 text-slate-200" />}
              </div>

              {/* Decorative background glow for Today */}
              {isToday && (
                <div className="absolute inset-0 bg-[var(--hr-primary)]/20 blur-2xl rounded-full -z-10" />
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default BusinessHours;