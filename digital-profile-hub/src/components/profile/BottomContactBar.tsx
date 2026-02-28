import { useState } from "react";
import { 
  MessageSquare, Phone, Share2, UserPlus, MapPin, X, Plus 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/api/api";

interface FloatingMenuProps {
  profile: any;
  theme: any; 
  ui: any;    
}

const FloatingContactMenu = ({ profile, theme, ui }: FloatingMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = async (url: string, type?: string) => {
    try {
      await api.post(`/profiles/${profile.id}/track-click`, { type });
    } catch (err) {
      console.error("Analytics error:", err);
    }

    if (url) {
      const finalUrl = url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') 
        ? url 
        : `https://${url}`;
      window.open(finalUrl, "_blank");
    }
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.user?.full_name || 'Contact'}\nTEL;TYPE=CELL:${profile.phone || ''}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `contact.vcf`);
    link.click();
    toast.success("Contact ready to save!");
  };

  return (
    <div className="fixed bottom-10 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Expanded Menu Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col items-end gap-4 mb-4"
          >
            <ActionButton 
                label="Save Contact" 
                icon={<UserPlus className="h-5 w-5" />} 
                onClick={downloadVCard} 
                theme={theme}
                isPrimary
            />

            <ActionButton 
                label="WhatsApp" 
                icon={<MessageSquare className="h-5 w-5" />} 
                onClick={() => handleAction(`https://wa.me/${profile.whatsapp}`, 'whatsapp')} 
                theme={theme}
            />

            <ActionButton 
                label="Call Now" 
                icon={<Phone className="h-5 w-5" />} 
                onClick={() => handleAction(`tel:${profile.phone}`, 'call')} 
                theme={theme}
            />

            {profile.google_map_link && (
                <ActionButton 
                    label="Location" 
                    icon={<MapPin className="h-5 w-5" />} 
                    onClick={() => handleAction(profile.google_map_link, 'location')} 
                    theme={theme}
                />
            )}

            <ActionButton 
                label="Share Link" 
                icon={<Share2 className="h-5 w-5" />} 
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                }} 
                theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle FAB */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-4 border-white/10",
          // Fix: Main button becomes neutral when open to focus on options, 
          // but uses accentContent when closed for visibility.
          isOpen 
            ? "bg-zinc-800 text-white" 
            : `${theme.accent} ${theme.accentContent || 'text-white'}`
        )}
      >
        {isOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <Plus className="h-8 w-8" />
        )}
      </motion.button>

      {/* Backdrop - respect theme background feel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md -z-10" 
              onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal Sub-component - Fully Theme Aware
const ActionButton = ({ label, icon, onClick, theme, isPrimary }: any) => (
    <motion.div 
      className="flex items-center gap-4 group cursor-pointer" 
      onClick={onClick}
      whileHover={{ x: -5 }}
    >
        <span className={cn(
          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl border backdrop-blur-md",
          theme.card,
          theme.text,
          theme.border,
          "bg-opacity-90"
        )}>
            {label}
        </span>
        <div className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 border-white/5", 
            // Fix: Use accentContent for icons when button is Primary
            isPrimary 
                ? `${theme.accent} ${theme.accentContent || 'text-white'}` 
                : "bg-zinc-800 text-zinc-100"
        )}>
            {icon}
        </div>
    </motion.div>
);

export default FloatingContactMenu;