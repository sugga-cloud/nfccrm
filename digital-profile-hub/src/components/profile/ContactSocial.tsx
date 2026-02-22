import { motion } from "framer-motion";
import { 
  Phone, Mail, MessageCircle, MapPin, Globe, 
  Instagram, Facebook, Linkedin, Youtube, Twitter, 
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
};

interface ContactSocialProps {
  data: {
    phone: string;
    email: string;
    whatsapp: string;
    mapUrl: string;
    website: string;
    socials: Record<string, string>;
  } | null;
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose";
}

const ContactSocial = ({ data, theme = "orange" }: ContactSocialProps) => {
  if (!data) return <div className="h-40 w-full animate-pulse bg-slate-50" />;

  const themeClasses = {
    orange: "[--con-primary:#f97316] [--con-bg:theme(colors.orange.50)]",
    blue: "[--con-primary:#3b82f6] [--con-bg:theme(colors.blue.50)]",
    purple: "[--con-primary:#a855f7] [--con-bg:theme(colors.purple.50)]",
    emerald: "[--con-primary:#10b981] [--con-bg:theme(colors.emerald.50)]",
    rose: "[--con-primary:#f43f5e] [--con-bg:theme(colors.rose.50)]",
  };

  const actions = [
    { id: 'call', val: data.phone, href: `tel:${data.phone}`, icon: Phone, label: "Call Now" },
    { id: 'wa', val: data.whatsapp, href: `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`, icon: MessageCircle, label: "WhatsApp" },
    { id: 'email', val: data.email, href: `mailto:${data.email}`, icon: Mail, label: "Email" },
    { id: 'map', val: data.mapUrl, href: data.mapUrl, icon: MapPin, label: "Visit Us" },
  ].filter(item => !!item.val);

  return (
    <section className={cn("w-full py-12 space-y-12", themeClasses[theme])}>
      
      {/* Primary Actions: Wide Floating List */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          {actions.map((action, idx) => (
            <motion.a
              key={action.id}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative w-full flex items-center justify-between p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-[var(--con-primary)] transition-all duration-300 overflow-hidden"
            >
              {/* Subtle Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--con-bg)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-[var(--con-primary)] transition-colors shadow-lg">
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{action.label}</p>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-[var(--con-primary)] transition-colors truncate max-w-[200px] md:max-w-md italic uppercase">
                    {action.val}
                  </p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-[var(--con-primary)] group-hover:translate-x-1 transition-all mr-2" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Social Bar: Edge-to-Edge Dark Dock */}
      <div className="relative w-full overflow-hidden">
        <div className="bg-slate-900 py-10 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">Follow the <span className="text-[var(--con-primary)]">Journey</span></h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Connect on social platforms</p>
            </div>

            <div className="flex flex-wrap justify-center gap-5">
              {Object.entries(data.socials || {}).map(([key, url], index) => {
                if (!url) return null;
                const Icon = iconMap[key as keyof typeof iconMap];
                if (!Icon) return null;

                return (
                  <motion.a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -8 }}
                    className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[var(--con-primary)] hover:border-transparent transition-all shadow-2xl"
                  >
                    <Icon className="h-6 w-6" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ContactSocial;