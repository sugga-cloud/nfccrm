import { useState } from "react";
import { 
  MessageSquare, Phone, Globe, Share2, 
  Instagram, Facebook, Linkedin, Youtube, Twitter, Link,
  UserPlus, ArrowLeftRight, MoreHorizontal, Copy, Check,
  MapPin // Added MapPin icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger 
} from "@/components/ui/drawer";
import api from "@/api/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BottomContactBarProps {
  profile: any;
}

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return <Instagram className="h-5 w-5" />;
    case 'facebook': return <Facebook className="h-5 w-5" />;
    case 'linkedin': return <Linkedin className="h-5 w-5" />;
    case 'youtube': return <Youtube className="h-5 w-5" />;
    case 'twitter': return <Twitter className="h-5 w-5" />;
    default: return <Link className="h-5 w-5" />;
  }
};

const BottomContactBar = ({ profile }: BottomContactBarProps) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Safety Check & Action Handler for Google Maps
  const handleMapAction = async () => {
    const mapUrl = profile.google_map_link;

    if (!mapUrl || mapUrl.trim() === "") {
      toast.error("No location provided");
      return;
    }

    // Basic URL validation
    if (!mapUrl.includes("google.com/maps") && !mapUrl.includes("goo.gl/maps")) {
       console.warn("Link might not be a standard Google Maps link, but attempting to open anyway.");
    }

    handleAction(mapUrl, 'directions');
  };

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
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.user?.full_name || 'NFC User'}
TEL;TYPE=CELL:${profile.phone || ''}
EMAIL:${profile.user?.email || ''}
URL:${window.location.href}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.username || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Contact file ready!");
  };

  return (
    <section className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="max-w-md mx-auto p-4 space-y-3">
        
        {/* TOP ROW: High Conversion Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={downloadVCard}
            className="bg-slate-900 hover:bg-black text-white rounded-2xl h-12 font-black uppercase tracking-tighter italic text-xs gap-2"
          >
            <UserPlus className="h-4 w-4 text-orange-500" />
            Add Contact
          </Button>

          <Button 
            onClick={() => document.getElementById('enquiry-section')?.scrollIntoView({ behavior: 'smooth' })}
            variant="outline"
            className="border-2 border-slate-900 rounded-2xl h-12 font-black uppercase tracking-tighter italic text-xs gap-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Exchange
          </Button>
        </div>

        {/* BOTTOM ROW: Quick Icons */}
        <div className="flex items-center justify-between px-2">
          {/* WhatsApp */}
          <button 
            onClick={() => handleAction(`https://wa.me/${profile.whatsapp}`, 'whatsapp')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
              <MessageSquare className="h-5 w-5 text-slate-600 group-hover:text-green-600" />
            </div>
          </button>

          {/* Call */}
          <button 
            onClick={() => handleAction(`tel:${profile.phone}`, 'call')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <Phone className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
            </div>
          </button>

          {/* NEW: Google Maps Icon */}
          {profile.google_map_link && (
            <button 
              onClick={handleMapAction}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <MapPin className="h-5 w-5 text-slate-600 group-hover:text-red-600" />
              </div>
            </button>
          )}

          {/* Social Drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center gap-1 group">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-slate-600 group-hover:text-orange-600" />
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-w-md mx-auto rounded-t-[3rem]">
              <DrawerHeader>
                <DrawerTitle className="text-center font-black italic uppercase tracking-tighter">Social Links</DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-cols-4 gap-6 p-8">
                {profile.sociallinks?.map((link: any) => (
                  <button 
                    key={link.id} 
                    onClick={() => handleAction(link.url, link.platform)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      {getSocialIcon(link.platform)}
                    </div>
                    <span className="text-[10px] font-bold uppercase">{link.platform}</span>
                  </button>
                ))}
              </div>
            </DrawerContent>
          </Drawer>

          {/* Easy Share Trigger */}
          <button 
            onClick={() => setIsShareOpen(true)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <Share2 className="h-5 w-5 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* EASY SHARE MODAL (Native + Copy) */}
      <Drawer open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DrawerContent className="max-w-md mx-auto rounded-t-[3rem] p-6 pb-12">
           <DrawerHeader>
              <DrawerTitle className="text-2xl font-black italic uppercase tracking-tighter">Spread the word</DrawerTitle>
           </DrawerHeader>
           <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                 <div className="flex-1 truncate text-sm font-medium text-slate-500">{window.location.href}</div>
                 <Button size="sm" variant="ghost" onClick={() => {
                   navigator.clipboard.writeText(window.location.href);
                   toast.success("Link copied!");
                 }}>
                   <Copy className="h-4 w-4" />
                 </Button>
              </div>
              <Button 
                className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 font-black uppercase italic"
                onClick={() => {
                  navigator.share({ title: profile.user?.full_name, url: window.location.href });
                  setIsShareOpen(false);
                }}
              >
                Open Native Share
              </Button>
           </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default BottomContactBar;