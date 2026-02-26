import { motion } from "framer-motion";
import { Globe, MapPin,ArrowLeftRight, Phone, Mail, MessageCircle, Share2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import {toast} from 'sonner';
import api from '@/api/api';
interface ProfileHeaderProps {
  data: {
    user: {
      full_name: string;
    };
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
    google_map_link?: string;
  } | null;
  theme?: "emerald" | "slate" | "indigo"; 
}

const ProfileHeader = ({ data, theme = "emerald" }: ProfileHeaderProps) => {
  if (!data) return <div className="h-screen w-full animate-pulse bg-slate-50" />;
  // Darker professional colors based on the screenshots
  const themeClasses = {
    emerald: "[--brand-primary:#2D6A4F] [--brand-secondary:#40916C] [--brand-light:#D8F3DC]",
    slate: "[--brand-primary:#1E293B] [--brand-secondary:#334155] [--brand-light:#F1F5F9]",
    indigo: "[--brand-primary:#312E81] [--brand-secondary:#4338CA] [--brand-light:#E0E7FF]",
  };
  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.user?.full_name || 'Contact'}\nTEL;TYPE=CELL:${data.phone || ''}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `contact.vcf`);
    link.click();
    toast.success("Contact ready to save!");
  };
const handleAction = async (url: string | undefined, type: string) => {
  if (!url || url.trim() === "") {
    toast.error(`No ${type} link provided`);
    return;
  }

  // Analytics tracking
  try {
    await api.post(`/profiles/${data.id}/track-click`, { type });
  } catch (err) {
    console.error("Analytics error:", err);
  }

  // Formatting and opening the URL
  const finalUrl = url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') 
    ? url 
    : `https://${url}`;
    
  window.open(finalUrl, "_blank");
};
  return (
    <section className={cn("min-h-screen bg-white font-sans pb-24", themeClasses[theme])}>
      {/* 1. Cover Image (Rectangular as per Screenshot 1) */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={data.cover_image} 
          alt="Cover" 
          className="h-full w-full object-cover" 
          onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab")}
        />
        {/* Language selector overlay - matches UI */}
        <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs flex items-center gap-1">
          <Globe className="w-3 h-3" /> English
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* 2. Profile Image (Circular & Overlapping) */}
        <div className="flex flex-col items-center -mt-24 relative z-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-44 w-44 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white"
          >
            <img 
              src={data.profile_image} 
              alt={data.user.full_name} 
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder-avatar.png")}
            />
          </motion.div>

          {/* 3. Name & Designation */}
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {data.user.full_name}
            </h1>
            <p className="text-[var(--brand-secondary)] font-semibold mt-1">
              {data.designation}
            </p>
            <p className="text-slate-500 text-sm font-medium leading-tight max-w-[250px] mx-auto mt-1">
              Powered By <br /> {data.company_name}
            </p>
          </div>

          {/* 4. Circular Social Grid (Matches Screenshot 1 & 2) */}
          <div className="grid grid-cols-5 gap-3 mt-8 max-w-sm">
  {[
    { Icon: Globe, link: data.website, type: 'website' },
    { Icon: MapPin, link: data.google_map_link, type: 'location' },
    { Icon: Mail, link: `mailto:${data.email}`, type: 'email' },
    { Icon: Phone, link: `tel:${data.phone}`, type: 'call' },
    { Icon: MessageCircle, link: `https://wa.me/${data.whatsapp}`, type: 'whatsapp' }
  ].map((item, i) => (
    <motion.button
      key={i}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => handleAction(item.link, item.type)}
      className={cn(
        "h-12 w-12 rounded-full border flex items-center justify-center transition-all shadow-sm",
        // Alternate styling: Orange for phone/whatsapp, Dark for others
        item.type === 'whatsapp' || item.type === 'call' 
          ? "bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white" 
          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900"
      )}
    >
      <item.Icon className="w-5 h-5" />
    </motion.button>
  ))}
</div>
        </div>

        {/* 5. About Section */}
        <div className="mt-10 px-4 text-center">
          <p className="text-slate-600 text-sm leading-relaxed">
            Welcome to <span className="font-bold">{data.user.full_name}</span>, your destination for cutting-edge <span className="font-bold text-slate-800">NFC-based smart business cards</span>. Our mission is to revolutionise the way professionals connect.
          </p>
        </div>

        {/* 6. Contact Grid (Matches Screenshot 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
           <ContactCard icon={<Mail />} label={data.email || "email@unogreen.in"} />
           <ContactCard icon={<Phone />} label={data.phone || "+91 8928486763"} />
           <ContactCard icon={<Phone className="rotate-90" />} label="+91 18002674999" />
           <ContactCard icon={<Globe />} label={data.website || "https:example.com"} />
        </div>
      </div>

    {/* 7. Sticky Action Buttons (Updated to Dark & Orange) */}
<div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center gap-3 z-50">
  <button 
    onClick={downloadVCard}
    className="flex-1 max-w-[180px] bg-orange-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(234,88,12,0.3)] active:scale-95 transition-all"
  >
    <UserPlus className="w-5 h-5" /> 
    <span className="text-xs uppercase tracking-wider">Add Contact</span>
  </button>
  
  <button 
    onClick={() => document.getElementById('enquiry-section')?.scrollIntoView({ behavior: 'smooth' })}
    className="flex-1 max-w-[180px] bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(15,23,42,0.3)] active:scale-95 transition-all border border-slate-800"
  >
    <ArrowLeftRight className="w-5 h-5 text-orange-500" /> 
    <a href="#enquiry"><span className="text-xs uppercase tracking-wider">Exchange</span></a>
  </button>
</div>
    </section>
  );
};

// Helper component for the contact pills
const ContactCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-[2rem] bg-[#F1F8F6] border border-[#E2EFEB] text-slate-700">
    <div className="text-[var(--brand-primary)] mb-1 scale-90">{icon}</div>
    <span className="text-xs font-semibold">{label}</span>
  </div>
);

export default ProfileHeader;