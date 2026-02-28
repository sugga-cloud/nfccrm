import { motion } from "framer-motion";
import { Clock } from "lucide-react";
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
    <section className={cn("w-full py-16 transition-colors duration-500", theme.bg)}>
      <div className="container mx-auto px-4">
        
        {/* Section Header - Layout Aware */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "flex flex-col mb-10",
            ui.layout === "minimal" ? "items-start" : "items-center"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
             <Clock className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-bold uppercase tracking-[0.3em] opacity-50", theme.text)}>
               Schedule
             </span>
          </div>
          <h2 className={cn("text-2xl font-black italic uppercase tracking-tighter", theme.text)}>
            Business Hours
          </h2>
          <div className={cn("w-12 h-1 mt-2 rounded-full", theme.accent)} />
        </motion.div>

        {/* Schedule Card */}
        <div className={cn(
          "max-w-md mx-auto border shadow-2xl overflow-hidden transition-all duration-500",
          theme.card,
          theme.border,
          ui.layout === "minimal" ? "rounded-2xl" : "rounded-[2.5rem]"
        )}>
          
          {/* Real-time Status Header */}
          <div className={cn(
            "px-8 py-5 border-b flex items-center justify-between bg-opacity-50", 
            theme.border,
            theme.name === "Pure Dark" ? "bg-zinc-800/30" : "bg-black/5"
          )}>
            <span className={cn("text-[10px] font-black uppercase tracking-widest opacity-60", theme.text)}>
              Current Status
            </span>
            <div className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2",
              isOpenNow 
                ? "bg-emerald-500/10 text-emerald-500" 
                : "bg-red-500/10 text-red-500"
            )}>
              <span className="relative flex h-2 w-2">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isOpenNow ? "bg-emerald-400" : "bg-red-400")}></span>
                <span className={cn("relative inline-flex rounded-full h-2 w-2", isOpenNow ? "bg-emerald-500" : "bg-red-500")}></span>
              </span>
              {isOpenNow ? "OPEN NOW" : "CLOSED"}
            </div>
          </div>

          {/* Clean Row List */}
          <div className={cn("divide-y", theme.name === "Pure Dark" ? "divide-white/5" : "divide-black/5")}>
            {data.map((row) => {
              const isToday = row.day === today;
              const isClosed = row.is_closed;

              return (
                <div
                  key={row.day}
                  className={cn(
                    "flex items-center justify-between px-8 py-5 transition-all",
                    isToday 
                      ? (theme.name === "Pure Dark" ? "bg-white/5" : "bg-black/[0.02]") 
                      : "hover:bg-black/[0.01]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-sm font-bold tracking-tight",
                      isToday ? theme.primary : "opacity-40",
                      theme.text
                    )}>
                      {row.day}
                    </span>
                    {isToday && (
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter", 
                        theme.accent, 
                        theme.accentContent || "text-white" // Fix for Pure Dark/Lime/Lemon themes
                      )}>
                        TODAY
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {!isClosed ? (
                      <p className={cn("text-xs font-bold tracking-tight", theme.text)}>
                        {formatTime(row.open_time)} 
                        <span className="mx-1.5 opacity-30 font-normal italic text-[10px]">to</span> 
                        {formatTime(row.close_time)}
                      </p>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-red-500/80">
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