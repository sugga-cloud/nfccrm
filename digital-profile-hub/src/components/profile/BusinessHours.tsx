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
  theme: any; 
  ui: any;    
}

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

const BusinessHours = ({ data, theme, ui }: BusinessHoursProps) => {
  if (!data || data.length === 0) return null;

  // Layout-specific styling mapping
  const layouts = {
    classic: { card: "rounded-none border-2", row: "py-4", status: "rounded-none", divide: "divide-y-2" },
    modern: { card: "rounded-[2.5rem] border shadow-2xl", row: "py-5", status: "rounded-full", divide: "divide-y" },
    glass: { card: "rounded-3xl backdrop-blur-xl bg-white/5 border-white/20 shadow-none", row: "py-5", status: "rounded-xl", divide: "divide-y divide-white/10" },
    minimal: { card: "rounded-2xl border-none shadow-none bg-secondary/5", row: "py-4", status: "rounded-lg", divide: "divide-y divide-black/5" },
    bento: { card: "rounded-3xl border-2 p-2", row: "py-4 rounded-2xl mb-1", status: "rounded-2xl", divide: "divide-none" },
  };

  const style = layouts[ui.id as keyof typeof layouts] || layouts.modern;

  const formatTime = (time: string | null) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const checkCurrentStatus = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const todayData = data.find((d) => d.day === today);

    if (!todayData || todayData.is_closed || !todayData.open_time || !todayData.close_time) return false;

    const open = parseInt(todayData.open_time.replace(":", ""));
    const close = parseInt(todayData.close_time.replace(":", ""));
    return currentTime >= open && currentTime <= close;
  };

  const isOpenNow = checkCurrentStatus();

  return (
    <section className={cn("w-full py-16 transition-all duration-500", theme.bg, ui.spacing)}>
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "flex flex-col mb-10",
            ui.id === "minimal" ? "items-start" : "items-center text-center"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
             <Clock className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-bold uppercase tracking-[0.3em] opacity-50", theme.text)}>
                Availability
             </span>
          </div>
          <h2 className={cn("text-2xl font-bold tracking-tight", theme.text)}>
            Business Hours
          </h2>
          {ui.id !== "minimal" && <div className={cn("w-12 h-1 mt-3 rounded-full", theme.accent)} />}
        </motion.div>

        {/* Schedule Container */}
        <div className={cn(
          "max-w-md mx-auto transition-all duration-500 overflow-hidden",
          style.card, theme.card, theme.border
        )}>
          
          {/* Status Bar */}
          <div className={cn(
            "px-6 py-4 flex items-center justify-between border-b", 
            theme.border,
            theme.name === "Pure Dark" ? "bg-white/5" : "bg-black/5"
          )}>
            <div className="flex items-center gap-2">
              <Calendar className={cn("h-3.5 w-3.5 opacity-40", theme.text)} />
              <span className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40", theme.text)}>
                Weekly Schedule
              </span>
            </div>
            <div className={cn(
              "px-3 py-1 text-[9px] font-black flex items-center gap-1.5 transition-all",
              style.status,
              isOpenNow 
                ? "bg-emerald-500/10 text-emerald-500" 
                : "bg-red-500/10 text-red-500"
            )}>
              <span className="relative flex h-1.5 w-1.5">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isOpenNow ? "bg-emerald-400" : "bg-red-400")}></span>
                <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", isOpenNow ? "bg-emerald-500" : "bg-red-500")}></span>
              </span>
              {isOpenNow ? "OPEN" : "CLOSED"}
            </div>
          </div>

          {/* Time Rows */}
          <div className={cn(style.divide)}>
            {data.map((row) => {
              const isToday = row.day === today;
              const isClosed = row.is_closed;

              return (
                <div
                  key={row.day}
                  className={cn(
                    "flex items-center justify-between px-6 transition-all",
                    style.row,
                    isToday && ui.id !== "bento" && (theme.name === "Pure Dark" ? "bg-white/5" : "bg-black/[0.03]"),
                    isToday && ui.id === "bento" && theme.accent + " " + (theme.accentContent || "text-white")
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xs font-bold",
                      isToday ? (ui.id === "bento" ? "text-inherit" : theme.primary) : "opacity-50",
                      ui.id !== "bento" && theme.text
                    )}>
                      {row.day}
                    </span>
                    {isToday && ui.id !== "bento" && (
                      <span className={cn(
                        "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter", 
                        theme.accent, theme.accentContent || "text-white"
                      )}>
                        Today
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {!isClosed ? (
                      <p className={cn(
                        "text-[11px] font-bold", 
                        ui.id === "bento" && isToday ? "text-inherit" : theme.text
                      )}>
                        {formatTime(row.open_time)} 
                        <span className="mx-1 opacity-30 font-normal"> - </span> 
                        {formatTime(row.close_time)}
                      </p>
                    ) : (
                      <span className={cn(
                        "text-[10px] font-bold uppercase opacity-40",
                        ui.id === "bento" && isToday ? "text-inherit" : "text-red-500"
                      )}>
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessHours;