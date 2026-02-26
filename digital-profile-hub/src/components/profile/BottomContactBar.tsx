import { useState } from "react";
import { 
  MessageSquare, Phone, Globe, Share2, 
  Instagram, Facebook, Linkedin, Youtube, Twitter, Link,
  UserPlus, ArrowLeftRight, MoreHorizontal, Copy, MapPin, X, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/api/api";

interface FloatingMenuProps {
  profile: any;
}

const FloatingContactMenu = ({ profile }: FloatingMenuProps) => {
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
    <div className="fixed top-1/2 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Expanded Menu Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col items-end gap-3 mb-2"
          >
            {/* Save Contact - High Importance */}
            <ActionButton 
                label="Save Contact" 
                icon={<UserPlus className="h-5 w-5" />} 
                onClick={downloadVCard} 
                color="bg-orange-500" // Bright Orange for primary action
            />

            {/* WhatsApp */}
            <ActionButton 
                label="WhatsApp" 
                icon={<MessageSquare className="h-5 w-5" />} 
                onClick={() => handleAction(`https://wa.me/${profile.whatsapp}`, 'whatsapp')} 
                color="bg-slate-800"
            />

            {/* Call */}
            <ActionButton 
                label="Call Now" 
                icon={<Phone className="h-5 w-5" />} 
                onClick={() => handleAction(`tel:${profile.phone}`, 'call')} 
                color="bg-slate-800"
            />

            {/* Directions */}
            {profile.google_map_link && (
                <ActionButton 
                    label="Location" 
                    icon={<MapPin className="h-5 w-5" />} 
                    onClick={() => handleAction(profile.google_map_link, 'location')} 
                    color="bg-slate-800"
                />
            )}

            {/* Share */}
            <ActionButton 
                label="Share Link" 
                icon={<Share2 className="h-5 w-5" />} 
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                }} 
                color="bg-slate-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 border-2 border-white",
          isOpen ? "bg-slate-900 rotate-0" : "bg-orange-600 rotate-0"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Soft Dark Backdrop */}
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] -z-10" 
            onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Internal Sub-component for individual buttons
const ActionButton = ({ label, icon, onClick, color }: any) => (
    <div className="flex items-center gap-3 group cursor-pointer" onClick={onClick}>
        <span className="bg-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-xl text-slate-800 border border-slate-100">
            {label}
        </span>
        <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-95", 
            color
        )}>
            {icon}
        </div>
    </div>
);

export default FloatingContactMenu;