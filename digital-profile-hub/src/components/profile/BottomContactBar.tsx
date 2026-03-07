import { useState } from "react";
import { 
  MessageSquare, Phone, Share2, UserPlus, MapPin, X, Plus, Globe, 
  Linkedin, Twitter, Instagram, Github, Facebook, LucideIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/api/api";

// 1. Icon Mapping Logic
const ICON_MAP: Record<string, LucideIcon> = {
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  github: Github,
  whatsapp: MessageSquare,
  phone: Phone,
  website: Globe,
  webste: Globe, // Handling your backend typo
  location: MapPin,
  default: Globe
};

const FloatingContactMenu = ({ profile, theme }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  profile.links = profile.sociallinks || []; // Handle both naming conventions from backend
  // 2. Analytics & Navigation
  const handleAction = async (url: string, type?: string) => {
    try {
      await api.post(`/profiles/${profile.id}/track-click`, { type });
    } catch (err) {
      console.error("Analytics error:", err);
    }

    if (url) {
      const finalUrl = url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') 
        ? url : `https://${url}`;
      window.open(finalUrl, "_blank");
    }
  };

  // 3. Robust vCard Generation
  const downloadVCard = () => {
    const fullName = profile.user?.full_name || 'Contact';
    const business = profile.business_name || '';
    
    let vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${fullName}`,
      `ORG:${business}`,
      `TITLE:${profile.job_title || ''}`,
      `TEL;TYPE=CELL:${profile.phone || ''}`,
      `EMAIL;TYPE=INTERNET:${profile.user?.email || ''}`,
    ];

    // Add Google Maps as a URL
    if (profile.google_map_link) {
      vcard.push(`URL;TYPE=LOCATION:${profile.google_map_link}`);
    }

    // Process Social Links for the VCF
    const notes: string[] = ["--- Social Profiles ---"];
    
    if (profile.links && Array.isArray(profile.links)) {
      profile.links.forEach((link: any) => {
        const platform = (link.platform || 'Link').toLowerCase();
        const url = link.url;
        
        // Add to plain-text notes so user can see links inside the contact app
        notes.push(`${link.platform}: ${url}`);

        // X-SOCIALPROFILE is the "magic" tag for iOS/Android social fields
        if (['facebook', 'instagram', 'twitter', 'linkedin', 'github'].includes(platform)) {
          vcard.push(`X-SOCIALPROFILE;TYPE=${platform}:${url}`);
        } else {
          vcard.push(`URL;TYPE=WORK:${url}`);
        }
      });
    }

    // Add all links to the Notes section as a backup
    vcard.push(`NOTE:${notes.join("\\n")}`);
    vcard.push("END:VCARD");

    const blob = new Blob([vcard.join("\n")], { type: "text/vcard;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fullName.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Contact with all links saved!");
  };

  return (
    <div className="fixed bottom-10 right-6 z-[100] flex flex-col items-end gap-3">
      {/* 4. The Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col items-end gap-4 mb-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
          >
            {/* Main Action: Save to Phone */}
            <ActionButton 
                label="Save Contact" 
                icon={<UserPlus className="h-5 w-5" />} 
                onClick={downloadVCard} 
                theme={theme}
                isPrimary
            />

            {/* Dynamic Social Links from Backend */}
            {profile.links?.map((link: any) => {
              const platformKey = link.platform?.toLowerCase() || 'default';
              const IconComponent = ICON_MAP[platformKey] || ICON_MAP.default;
              const displayLabel = link.platform === "Webste" ? "Website" : link.platform;

              return (
                <ActionButton 
                  key={link.id}
                  label={displayLabel} 
                  icon={<IconComponent className="h-5 w-5" />} 
                  onClick={() => handleAction(link.url, link.platform)} 
                  theme={theme}
                />
              );
            })}

            {/* Standard Call Button */}
            {profile.phone && (
              <ActionButton 
                label="Call Now" 
                icon={<Phone className="h-5 w-5" />} 
                onClick={() => handleAction(`tel:${profile.phone}`, 'call')} 
                theme={theme}
              />
            )}

            {/* Share Profile Link */}
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

      {/* 5. Main Toggle FAB */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-4 border-white/10",
          isOpen ? "bg-zinc-900 text-white" : `${theme.accent} ${theme.accentContent || 'text-white'}`
        )}
      >
        {isOpen ? <X className="h-7 w-7" /> : <Plus className="h-8 w-8" />}
      </motion.button>

      {/* Background Blur Overlay */}
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

// 6. Styled Action Button Sub-component
const ActionButton = ({ label, icon, onClick, theme, isPrimary }: any) => (
    <motion.div 
      className="flex items-center gap-4 group cursor-pointer" 
      onClick={onClick}
      whileHover={{ x: -5 }}
    >
        <span className={cn(
          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl border backdrop-blur-md whitespace-nowrap",
          theme.card, theme.text, theme.border, "bg-opacity-90"
        )}>
            {label}
        </span>
        <div className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 border-white/5", 
            isPrimary ? `${theme.accent} ${theme.accentContent || 'text-white'}` : "bg-zinc-800 text-zinc-100"
        )}>
            {icon}
        </div>
    </motion.div>
);

export default FloatingContactMenu;