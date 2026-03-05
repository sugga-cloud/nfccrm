import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Check, Smartphone, Save, Loader2, 
  Layout, Layers, MousePointer2, Sparkles, Box
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import api from "@/api/api"; 
import { themeRegistry } from "@/config/themeConfig"; 

interface AdminProps {
  initialThemeId?: string | number;
  initialUiId?: string;
  onSave?: (themeId: string | number, uiId: string) => void;
  onConfigChange?: (themeId: string | number, uiId: string) => void;
  disableApi?: boolean;
  profileId?: string;
}

const AdminThemeSelector = ({ 
  initialThemeId = "1", 
  initialUiId = "modern",
  onSave, 
  disableApi = false,
  onConfigChange,
  profileId=""
}: AdminProps) => {
  
  // 1. Setup Data from Registry
  const themesList = useMemo(() => Object.values(themeRegistry.themes), []);
  const interfaces = [
    { id: "1", name: "Classic", icon: Box, desc: "Sharp, Professional, Rigid" },
    { id: "2", name: "Modern", icon: MousePointer2, desc: "Soft Shadows, Rounded" },
    { id: "3", name: "Glass", icon: Layers, desc: "Frost Blur, Translucent" },
    { id: "4", name: "Minimal", icon: Layout, desc: "Clean, Flat, Spacing-focused" },
    { id: "5", name: "Bento", icon: Sparkles, desc: "Modular Tiles, Playful" },
  ];

  // 2. State Management
  const [selectedTheme, setSelectedTheme] = useState<any>(
    themeRegistry.themes[initialThemeId as keyof typeof themeRegistry.themes] || themesList[0]
  );
  const [selectedUi, setSelectedUi] = useState(initialUiId);
  const [isSaving, setIsSaving] = useState(false);

  // Sync internal state with parent props
  React.useEffect(() => {
    const t = themeRegistry.themes[initialThemeId as keyof typeof themeRegistry.themes];
    if (t) setSelectedTheme(t);
    if (initialUiId) setSelectedUi(initialUiId);
  }, [initialThemeId, initialUiId]);

  // Notify parent of changes
  const updateConfig = (theme: any, ui: string) => {
    setSelectedTheme(theme);
    setSelectedUi(ui);
    if (onConfigChange) onConfigChange(theme.id, ui);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!disableApi) {
        const payload: any = {
          theme_id: selectedTheme.id,
          interface_id: selectedUi,
        };
        
        // Determine endpoint based on context:
        // If profileId is explicitly provided → admin endpoint
        // Otherwise → user endpoint
        let endpoint = "/profile/update-theme";
        const pid = profileId || localStorage.getItem("profileId");
        
        if (profileId && profileId !== "") {
          // Admin context: explicit profileId provided
          endpoint = `/admin/profiles/${profileId}/update-theme`;
        }

        await api.post(endpoint, payload);
        toast.success("Identity config updated!");
      }
      if (onSave) onSave(selectedTheme.id, selectedUi);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update configuration");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: CONFIGURATION PANEL */}
        <div className="lg:col-span-7 space-y-12">
          <header>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-zinc-900 leading-none">
              Brand <br /> Architect
            </h1>
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-4">
              Visual & Structural Configuration
            </p>
          </header>

          {/* 1. INTERFACE SELECTOR (NEW) */}
          <section>
            <div className="flex items-center gap-3 mb-6 px-5 py-2.5 bg-white w-fit rounded-full text-zinc-600 border border-zinc-200 shadow-sm">
              <Layout className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">1. Structural Layout</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {interfaces.map((ui) => (
                <button
                  key={ui.id}
                  onClick={() => updateConfig(selectedTheme, ui.id)}
                  className={cn(
                    "flex flex-col p-4 rounded-3xl border-2 transition-all text-left group",
                    selectedUi === ui.id 
                      ? "border-zinc-900 bg-white shadow-lg" 
                      : "border-transparent bg-zinc-200/50 hover:bg-zinc-200"
                  )}
                >
                  <ui.icon className={cn("w-5 h-5 mb-3", selectedUi === ui.id ? "text-zinc-900" : "text-zinc-400")} />
                  <p className="font-black text-[10px] uppercase tracking-tighter italic">{ui.name}</p>
                  <p className="text-[8px] opacity-50 font-medium leading-tight mt-1">{ui.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* 2. THEME SELECTOR */}
          <section>
            <div className="flex items-center gap-3 mb-6 px-5 py-2.5 bg-white w-fit rounded-full text-zinc-600 border border-zinc-200 shadow-sm">
              <Palette className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">2. Color Palette</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {themesList.map((t: any) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => updateConfig(t, selectedUi)}
                  className={cn(
                    "group relative p-5 rounded-[2rem] border-2 transition-all duration-500 text-left",
                    selectedTheme.id === t.id 
                      ? "border-zinc-900 bg-white shadow-xl scale-[1.02]" 
                      : "border-zinc-100 bg-white/50 hover:border-zinc-200 grayscale-[0.6] hover:grayscale-0"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-inner relative group-hover:rotate-3 transition-transform", t.bg)}>
                       <div className={cn("absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-white shadow-sm", t.accent)} />
                    </div>
                    <div>
                      <p className="font-black text-[11px] uppercase italic tracking-tighter text-zinc-900">{t.name}</p>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-0.5">Palette Code: {t.id}</p>
                    </div>
                  </div>
                  {selectedTheme.id === t.id && (
                    <div className="absolute top-4 right-4 bg-zinc-900 text-white p-1 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: DYNAMIC PREVIEW */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-10 w-full max-w-[340px]">
            <div className="relative aspect-[9/18.5] w-full bg-zinc-900 rounded-[3.5rem] p-3 shadow-2xl border-[8px] border-zinc-800">
                {/* Simulated Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-800 rounded-full z-20" />
                
                <div className={cn(
                    "w-full h-full rounded-[2.8rem] overflow-hidden transition-all duration-700 flex flex-col relative",
                    selectedTheme.bg
                )}>
                    {/* Header Image Placeholder */}
                    <div className="h-28 w-full bg-zinc-900/10 backdrop-blur-sm" />
                    
                    <div className={cn(
                      "flex flex-col px-6 -mt-10 transition-all duration-500",
                      selectedUi === "4" ? "items-start" : "items-center"
                    )}>
                        {/* Profile Pic */}
                        <div className={cn(
                            "h-20 w-20 border-[4px] shadow-xl transition-all duration-700 mb-4",
                            selectedTheme.card,
                            selectedTheme.border,
                            selectedUi === "1" ? "rounded-none" : "rounded-full"
                        )} />
                        
                        {/* Name Bar */}
                        <div className={cn("h-3 w-28 rounded-full mb-2 opacity-80", selectedTheme.text?.replace('text-', 'bg-') || "bg-zinc-800")} />
                        {/* Title Bar */}
                        <div className={cn("h-1.5 w-16 rounded-full mb-8 opacity-30", selectedTheme.primary?.replace('text-', 'bg-') || "bg-zinc-400")} />
                        
                        {/* Mock Component Grid */}
                        <div className={cn(
                          "grid w-full gap-2 transition-all duration-500",
                          selectedUi === "5" ? "grid-cols-2" : "grid-cols-1"
                        )}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className={cn(
                                    "h-10 border transition-all duration-500 shadow-sm",
                                    selectedTheme.card,
                                    selectedTheme.border,
                                    selectedUi === "3" && "backdrop-blur-md bg-white/10",
                                    selectedUi === "1" ? "rounded-none" : "rounded-xl",
                                    selectedUi === "5" && i === 1 ? "col-span-2 h-14" : ""
                                )} />
                            ))}
                        </div>
                        
                        {/* Action Button */}
                        <div className={cn(
                            "mt-6 h-10 w-full shadow-lg flex items-center justify-center font-black text-[8px] tracking-[0.2em] uppercase transition-all duration-700",
                            selectedTheme.accent,
                            selectedTheme.accentContent || "text-white",
                            selectedUi === "1" ? "rounded-none" : "rounded-xl"
                        )}>
                            Confirm Booking
                        </div>
                    </div>
                </div>
            </div>

            {!disableApi && (
              <div className="mt-8 space-y-4">
                  <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full h-16 rounded-[2rem] bg-zinc-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl disabled:opacity-70 transition-transform active:scale-95"
                  >
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      {isSaving ? "Finalizing..." : "Publish Configuration"}
                  </Button>
                  <div className="flex items-center justify-center gap-3 text-zinc-400 font-black text-[9px] uppercase tracking-[0.4em]">
                      <Smartphone className="w-3.5 h-3.5" /> 
                      Mobile Preview Mode
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminThemeSelector;