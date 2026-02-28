import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Palette, Check, Smartphone, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import your custom axios instance
import api from "@/api/api"; 
import { themeRegistry } from "@/config/themeConfig"; 

interface AdminProps {
  initialThemeId?: string | number;
  onSave?: (themeId: string | number) => void;
}

const AdminThemeSelector = ({ 
  initialThemeId = "1", 
  onSave 
}: AdminProps) => {
  
  // 1. Setup Theme List from Registry
  const themesList = useMemo(() => Object.values(themeRegistry.themes), []);

  // 2. State Management
  const [selectedTheme, setSelectedTheme] = useState<any>(
    themeRegistry.themes[initialThemeId as keyof typeof themeRegistry.themes] || themesList[0]
  );
  const [isSaving, setIsSaving] = useState(false);

  // 3. Save Function using your Axios Instance
  const handleSave = async () => {
    setIsSaving(true);
    console.log(selectedTheme);
    try {
      const response = await api.post("/profile/update-theme", {
        theme_id: selectedTheme.id,
      });

      if (response.status === 200) {
        toast.success("Theme identity updated!");
        if (onSave) onSave(selectedTheme.id);
      }
    } catch (error: any) {
      // Interceptors handle 401/403, we handle specific 422 or 500 here
      const message = error.response?.data?.message || "Failed to update theme";
      toast.error(message);
      console.error("Theme Update Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: SELECTION PANEL */}
        <div className="lg:col-span-7">
          <header className="mb-10">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-zinc-900 leading-none">
              Identity <br /> Designer
            </h1>
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-4">
              Visual Profile Configuration
            </p>
          </header>

          <div className="flex items-center gap-3 mb-8 px-5 py-2.5 bg-zinc-100 w-fit rounded-full text-zinc-600 border border-zinc-200">
            <Palette className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Select Palette</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {themesList.map((t: any) => (
              <button
                key={t.id}
                disabled={isSaving}
                onClick={() => setSelectedTheme(t)}
                className={cn(
                  "group relative p-6 rounded-[2.5rem] border-2 transition-all duration-500 text-left",
                  selectedTheme.id === t.id 
                    ? "border-zinc-900 bg-white shadow-2xl scale-[1.02] z-10" 
                    : "border-zinc-100 bg-white/50 hover:border-zinc-300 grayscale-[0.5] hover:grayscale-0",
                  isSaving && "opacity-50 cursor-wait"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner relative transition-transform group-hover:rotate-3", t.bg)}>
                     <div className={cn("absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-[3px] border-white shadow-sm", t.accent)} />
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase italic tracking-tighter text-zinc-900">{t.name}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">ID: {t.id}</p>
                  </div>
                </div>
                {selectedTheme.id === t.id && (
                  <motion.div 
                    layoutId="activeCheck"
                    className="absolute top-5 right-5 bg-zinc-900 text-white p-1.5 rounded-full"
                  >
                    <Check className="w-3 h-3" />
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-10 w-full max-w-[320px]">
            {/* iPhone Frame */}
            <div className="relative aspect-[9/18.5] w-full bg-zinc-900 rounded-[3.2rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[7px] border-zinc-800">
                {/* Dynamic Content */}
                <div className={cn(
                    "w-full h-full rounded-[2.5rem] overflow-hidden transition-all duration-1000 flex flex-col relative",
                    selectedTheme.bg
                )}>
                    {/* Header Image Placeholder */}
                    <div className="h-32 w-full bg-zinc-900/10 backdrop-blur-sm" />
                    
                    <div className="flex flex-col items-center -mt-12 px-6">
                        {/* Profile Pic Circle */}
                        <div className={cn(
                            "h-24 w-24 border-[5px] shadow-2xl transition-all duration-700 mb-4 rounded-full",
                            selectedTheme.card,
                            selectedTheme.border
                        )} />
                        
                        {/* Name Bar */}
                        <div className={cn("h-4 w-32 rounded-full mb-2 opacity-80", selectedTheme.text?.replace('text-', 'bg-') || "bg-zinc-800")} />
                        {/* Title Bar */}
                        <div className={cn("h-2 w-20 rounded-full mb-10 opacity-30", selectedTheme.primary?.replace('text-', 'bg-') || "bg-zinc-400")} />
                        
                        {/* Mock Links Grid */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={cn(
                                    "h-12 border transition-all duration-500 rounded-2xl shadow-sm",
                                    selectedTheme.card,
                                    selectedTheme.border
                                )} />
                            ))}
                        </div>
                        
                        {/* Action Button */}
                        <div className={cn(
                            "mt-10 h-12 w-full rounded-2xl shadow-xl flex items-center justify-center font-black text-[9px] tracking-[0.2em] uppercase transition-all duration-700",
                            selectedTheme.accent,
                            selectedTheme.accentContent || "text-white"
                        )}>
                            Contact Card
                        </div>
                    </div>
                </div>
            </div>

            {/* Persistence Controls */}
            <div className="mt-10 space-y-4">
                <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-16 rounded-[1.8rem] bg-zinc-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 shadow-lg disabled:opacity-70"
                >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? "Syncing..." : "Publish Theme"}
                </Button>
                
                <div className="flex items-center justify-center gap-2.5 text-zinc-300 font-black text-[9px] uppercase tracking-[0.4em]">
                    <Smartphone className="w-3.5 h-3.5" /> 
                    Live Environment
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminThemeSelector;