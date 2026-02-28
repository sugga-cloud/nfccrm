import { motion } from "framer-motion";
import { Globe, MapPin, ArrowLeftRight, Phone, Mail, MessageCircle, UserPlus, Share2 } from "lucide-react";
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
  if (!data) return <div className="h-screen w-full animate-pulse bg-slate-50" />;

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.user?.full_name || 'Contact'}\nORG:${data.company_name}\nTITLE:${data.designation}\nTEL;TYPE=CELL:${data.phone || ''}\nEMAIL:${data.email || ''}\nURL:${data.website || ''}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${data.user?.full_name.replace(/\s+/g, '_')}.vcf`);
    link.click();
    toast.success("Contact ready to save!");
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
    <section className={cn("min-h-screen font-sans pb-32 transition-colors duration-500", theme.bg)}>
      {/* 1. Cover Image with Dynamic Overlay */}
      <div className={cn(
        "relative w-full overflow-hidden group",
        ui.layout === "glass" ? "h-72 rounded-b-[4rem]" : "h-60"
      )}>
        <img 
          src={data.cover_image} 
          alt="Cover" 
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab")}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
        
        <div className="absolute top-6 right-6 flex gap-2">
            <button 
                onClick={() => navigator.share({ title: data.user.full_name, url: window.location.href })}
                className="bg-white/20 backdrop-blur-xl p-2.5 rounded-full text-white border border-white/20 active:scale-90 transition-all"
            >
                <Share2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* 2. Profile Image & Identity */}
        <div className="flex flex-col items-center -mt-28 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "h-48 w-48 border-[8px] shadow-2xl overflow-hidden transition-all duration-500",
              ui.layout === "minimal" ? "rounded-[2.5rem]" : "rounded-full",
              theme.card,
              theme.border
            )}
          >
            <img 
              src={data.profile_image} 
              alt={data.user.full_name} 
              className="h-full w-full object-cover bg-white p-1"
              onError={(e) => (e.currentTarget.src = "/placeholder-avatar.png")}
            />
          </motion.div>

          <div className="text-center mt-6">
            <h1 className={cn("text-3xl font-black italic uppercase tracking-tighter", theme.text)}>
              {data.user.full_name}
            </h1>
            <p className={cn("font-black uppercase tracking-[0.2em] text-[10px] mt-2 py-1 px-4 rounded-full inline-block bg-opacity-10", theme.primary, theme.primary.replace('text-', 'bg-'))}>
              {data.designation}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 opacity-50">
                <div className={cn("h-px w-8", theme.accent)} />
                <p className={cn("text-[10px] font-bold uppercase tracking-widest", theme.text)}>
                   {data.company_name}
                </p>
                <div className={cn("h-px w-8", theme.accent)} />
            </div>
          </div>

          {/* 3. Quick Action Social Grid */}
          <div className="flex flex-wrap justify-center gap-4 mt-10 max-w-md">
            {[
              { Icon: Globe, link: data.website, type: 'website' },
              { Icon: MapPin, link: data.google_map_link, type: 'location' },
              { Icon: Mail, link: `mailto:${data.email}`, type: 'email' },
              { Icon: Phone, link: `tel:${data.phone}`, type: 'call' },
              { Icon: MessageCircle, link: `https://wa.me/${data.whatsapp}`, type: 'whatsapp' }
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAction(item.link, item.type)}
                className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl border-2",
                  item.type === 'whatsapp' || item.type === 'call' 
                    ? `${theme.accent} ${theme.accentContent || 'text-white'} border-transparent` 
                    : `${theme.card} ${theme.text} ${theme.border} hover:border-current`
                )}
              >
                <item.Icon className="w-6 h-6" strokeWidth={2.5} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* 4. Contact Info Bento Grid */}
        <div className={cn(
          "grid gap-4 mt-12",
          ui.layout === "grid" ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
        )}>
           <ContactCard theme={theme} ui={ui} icon={<Mail />} label={data.email || "Send an Email"} sub="Direct Contact" />
           <ContactCard theme={theme} ui={ui} icon={<Phone />} label={data.phone || "Call Now"} sub="Mobile" />
           <ContactCard theme={theme} ui={ui} icon={<Globe />} label={data.website || "Visit Website"} sub="Online Portfolio" />
           <ContactCard theme={theme} ui={ui} icon={<MapPin />} label={data.address || "Find Us"} sub="Office Address" />
        </div>
      </div>

      {/* 5. Fixed Premium Footer Actions */}
      <div className="fixed bottom-8 left-0 right-0 px-8 flex justify-center gap-4 z-50 pointer-events-none">
        <button 
          onClick={downloadVCard}
          className={cn(
            "flex-1 max-w-[200px] py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-95 transition-all pointer-events-auto",
            theme.accent, 
            theme.accentContent || "text-white"
          )}
        >
          <UserPlus className="w-5 h-5" /> 
          Save Contact
        </button>
        
        <button 
          onClick={() => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })}
          className={cn(
            "flex-1 max-w-[200px] py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all border-2 backdrop-blur-xl pointer-events-auto",
            theme.card, theme.text, theme.border
          )}
        >
          <ArrowLeftRight className={cn("w-5 h-5", theme.primary)} /> 
          Enquire
        </button>
      </div>
    </section>
  );
};

const ContactCard = ({ icon, label, sub, theme, ui }: { icon: React.ReactNode, label: string, sub?: string, theme: any, ui: any }) => (
  <div className={cn(
    "flex items-center p-5 border shadow-sm transition-all group hover:shadow-xl",
    theme.card, 
    theme.border, 
    theme.text,
    ui.layout === "minimal" ? "rounded-3xl" : "rounded-[2rem]"
  )}>
    <div className={cn(
        "p-3 rounded-2xl mr-4 transition-transform group-hover:scale-110 bg-opacity-10", 
        theme.primary,
        theme.primary.replace('text-', 'bg-')
    )}>
        {icon}
    </div>
    <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-0.5">{sub}</span>
        <span className="text-xs font-bold truncate">{label}</span>
    </div>
  </div>
);

export default ProfileHeader;