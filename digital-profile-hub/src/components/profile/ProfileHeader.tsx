import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Globe, MapPin, ArrowLeftRight, Phone, Mail, 
  MessageCircle, UserPlus, Share2, Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import api from '@/api/api';

interface ProfileHeaderProps {
  data: {
    user: { full_name: string };
    id: any;
    designation: string;
    company_name: string;
    company_description: string;
    cover_image: string;
    profile_image: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    whatsapp?: string;
    google_map_link?: string;
  } | null;
  theme: any; 
  ui: any;
}

const ProfileHeader = ({ data, theme, ui }: ProfileHeaderProps) => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax animations for the Cover Image
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityCover = useTransform(scrollY, [0, 300], [1, 0]);
  const scaleCover = useTransform(scrollY, [0, 300], [1, 1.15]);

  if (!data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-slate-200 rounded-full" />
          <div className="h-4 w-48 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  // Layout System Mapping
  const layouts = {
    classic: { 
      cover: "h-52 rounded-none", 
      avatar: "rounded-none", 
      actions: "rounded-none", 
      card: "rounded-none",
      innerCard: "rounded-none"
    },
    modern: { 
      cover: "h-72 rounded-b-[4rem]", 
      avatar: "rounded-full", 
      actions: "rounded-2xl", 
      card: "rounded-[2.5rem]",
      innerCard: "rounded-2xl"
    },
    glass: { 
      cover: "h-80 rounded-b-[5rem]", 
      avatar: "rounded-[3.5rem]", 
      actions: "rounded-full", 
      card: "rounded-[2rem] backdrop-blur-2xl border-white/20 bg-white/10 shadow-2xl",
      innerCard: "rounded-3xl"
    },
    minimal: { 
      cover: "h-56 rounded-[2.5rem] mt-4 mx-4 shadow-lg", 
      avatar: "rounded-3xl", 
      actions: "rounded-2xl", 
      card: "rounded-3xl border-none shadow-none bg-secondary/5",
      innerCard: "rounded-2xl"
    },
    bento: { 
      cover: "h-64 rounded-[3rem] mt-6 mx-6 shadow-xl", 
      avatar: "rounded-[2.5rem]", 
      actions: "rounded-2xl", 
      card: "rounded-[2.5rem] hover:shadow-2xl transition-all",
      innerCard: "rounded-[1.5rem]"
    },
  };

  const style = layouts[ui.id as keyof typeof layouts] || layouts.modern;
  const downloadVCard = () => {
    const fullName = data.user?.full_name || 'Contact';
    let profile = data;
    const links = data.sociallinks || data.links || []; 
  
    let vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${fullName}`,
      `ORG:${profile.business_name || ''}`,
      `TITLE:${profile.job_title || ''}`,
      `TEL;TYPE=CELL,VOICE:${profile.phone || ''}`,
      `EMAIL;TYPE=INTERNET,WORK:${profile.user?.email || ''}`,
    ];
  
    // 1. Standard Website
    if (profile.website) {
      vcard.push(`URL;TYPE=WORK:${profile.website}`);
    }
  
    // 2. Google Maps (Better as an Address or specific URL label)
    if (profile.google_map_link) {
      vcard.push(`URL;TYPE=LOCATION:${profile.google_map_link}`);
    }
  
    // 3. Process Dynamic Links (Mapping platform to specific VCard Types)
    if (Array.isArray(links)) {
      links.forEach((link) => {
        const platform = (link.platform || 'Link').toLowerCase().trim();
        const url = link.url;
        
        const socialPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'github', 'youtube', 'tiktok', 'snapchat'];
  
        if (socialPlatforms.includes(platform)) {
          // Correct format for iOS/Android social integration
          vcard.push(`X-SOCIALPROFILE;TYPE=${platform}:${url}`);
        } else {
          // For custom platforms (Portfolio, Calendly, etc.), use the platform name as the label
          vcard.push(`URL;TYPE=${platform.toUpperCase()}:${url}`);
        }
      });
    }
  
    vcard.push("END:VCARD");
  
    // Trigger Download logic
    const vcardString = vcard.join("\n");
    const blob = new Blob([vcardString], { type: "text/vcard;charset=utf-8" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.setAttribute("download", `${fullName.replace(/\s+/g, '_')}_Contact.vcf`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Contact card exported successfully!");
  };
  const handleAction = async (url: string | undefined, type: string) => {
    if (!url || url.trim() === "" || url.includes('undefined')) {
      toast.error(`No ${type} link provided`);
      return;
    }
    try {
      await api.post(`/profiles/${data.id}/track-click`, { type });
    } catch (err) {
      console.error("Analytics error:", err);
    }
    const finalUrl = url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') 
      ? url 
      : `https://${url}`;
    window.open(finalUrl, "_blank");
  };

  return (
    <section ref={containerRef} className={cn("min-h-screen pb-40 transition-all duration-700 relative", theme.bg)}>
      
      {/* --- 1. PARALLAX COVER SECTION --- */}
      <div className={cn("relative overflow-hidden z-0", style.cover)}>
        <motion.div style={{ y, scale: scaleCover, opacity: opacityCover }} className="absolute inset-0">
          <img 
            src={data.cover_image} 
            alt="Cover" 
            className="h-full w-full object-cover" 
            onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab")}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        </motion.div>
        
        {/* Floating Share Button */}
        <div className="absolute top-8 right-8 z-20">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigator.share({ title: data.user.full_name, url: window.location.href })}
              className="bg-white/20 backdrop-blur-2xl p-3 rounded-full text-white border border-white/30 shadow-2xl"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- 2. IDENTITY SECTION --- */}
        <div className="flex flex-col items-center -mt-32">
          {/* Main Avatar with Depth Shadow */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className={cn(
              "h-48 w-48 border-[8px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative group",
              style.avatar, theme.card, theme.border
            )}
          >
            <img 
              src={data.profile_image} 
              alt={data.user.full_name} 
              className="h-full w-full object-cover bg-white transition-transform duration-700 group-hover:scale-110"
              onError={(e) => (e.currentTarget.src = "/placeholder-avatar.png")}
            />
            {ui.id === 'glass' && <div className="absolute inset-0 pointer-events-none ring-inset ring-1 ring-white/40" />}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-8 px-4"
          >
            <h1 className={cn("text-4xl font-extrabold tracking-tight mb-2", theme.text)}>
              {data.user.full_name}
            </h1>
            <div className="flex items-center justify-center gap-2">
               <Sparkles className={cn("w-3 h-3", theme.primary)} />
               <p className={cn("font-black uppercase tracking-[0.3em] text-[10px] opacity-70", theme.text)}>
                {data.designation}
               </p>
            </div>
            <p className={cn("text-[11px] font-bold uppercase tracking-widest mt-3 opacity-50", theme.text)}>
              {data.company_name}
            </p>
          </motion.div>

          {/* --- 3. MAGNETIC QUICK ACTIONS --- */}
          <div className="flex flex-wrap justify-center gap-4 mt-10 max-w-sm">
            {[
              { Icon: Globe, link: data.website, type: 'website' },
              { Icon: MapPin, link: data.google_map_link, type: 'location' },
              { Icon: Mail, link: `mailto:${data.email}`, type: 'email' },
              { Icon: Phone, link: `tel:${data.phone}`, type: 'call' },
              { Icon: MessageCircle, link: `https://wa.me/${data.whatsapp}`, type: 'whatsapp' }
            ].map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -8, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAction(item.link, item.type)}
                className={cn(
                  "h-14 w-14 flex items-center justify-center transition-all shadow-xl border-2",
                  style.actions,
                  item.type === 'whatsapp' || item.type === 'call' 
                    ? `${theme.accent} ${theme.accentContent || 'text-white'} border-transparent ring-4 ring-opacity-10 ${theme.accent.replace('bg-', 'ring-')}` 
                    : `${theme.card} ${theme.text} ${theme.border} hover:border-current`
                )}
              >
                <item.Icon className="w-6 h-6" strokeWidth={2.5} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* --- 4. DETAILED INFO CARDS --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "grid gap-4 mt-16 transition-all duration-500",
            ui.id === "bento" ? "grid-cols-2 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
          )}
        >
           <ContactCard theme={theme} ui={ui} style={style} icon={<Mail className="w-5 h-5" />} label={data.email} sub="Email Address" />
           <ContactCard theme={theme} ui={ui} style={style} icon={<Phone className="w-5 h-5" />} label={data.phone} sub="Phone Number" />
           <ContactCard theme={theme} ui={ui} style={style} icon={<Globe className="w-5 h-5" />} label={data.website} sub="Business Website" />
           <ContactCard theme={theme} ui={ui} style={style} icon={<MapPin className="w-5 h-5" />} label={data.address} sub="Office Location" />
        </motion.div>
      </div>

      {/* --- 5. STICKY FLOATING FOOTER --- */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-50 pointer-events-none">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="max-w-md mx-auto flex gap-3 pointer-events-auto"
        >
          <button 
            onClick={downloadVCard}
            className={cn(
              "flex-[2] py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all",
              theme.accent, theme.accentContent || "text-white", style.actions
            )}
          >
            <UserPlus className="w-5 h-5" /> Save Contact
          </button>
          
          <button 
            onClick={() => {
              const element = document.getElementById('enquiry');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={cn(
              "flex-1 py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center shadow-xl active:scale-95 transition-all border-2 backdrop-blur-2xl",
              theme.card, theme.text, theme.border, style.actions
            )}
          >
            Enquire
          </button>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * CONTACT CARD SUB-COMPONENT
 */
const ContactCard = ({ icon, label, sub, theme, style }: any) => (
  <motion.div 
    whileHover={{ x: 8 }}
    className={cn(
      "flex items-center p-5 border transition-all duration-300 group cursor-pointer",
      theme.card, theme.border, theme.text, style.innerCard,
      "hover:shadow-lg active:scale-95"
    )}
  >
    <div className={cn(
        "p-3.5 rounded-2xl mr-4 bg-opacity-10 transition-colors group-hover:bg-opacity-20", 
        theme.primary, theme.primary.replace('text-', 'bg-')
    )}>
        {icon}
    </div>
    <div className="flex flex-col min-w-0">
        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 leading-none">{sub}</span>
        <span className="text-[13px] font-bold truncate leading-tight">{label || `Add ${sub}`}</span>
    </div>
  </motion.div>
);

export default ProfileHeader;