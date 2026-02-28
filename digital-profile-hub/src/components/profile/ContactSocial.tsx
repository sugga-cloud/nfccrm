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
  theme: any; 
  ui: any;    
}

const ContactSocial = ({ data, theme, ui }: ContactSocialProps) => {
  if (!data) return <div className={cn("h-40 w-full animate-pulse rounded-3xl", theme.card)} />;

  const actions = [
    { id: 'call', val: data.phone, href: `tel:${data.phone}`, icon: Phone, label: "Call Now" },
    { id: 'wa', val: data.whatsapp, href: `https://wa.me/${data.whatsapp?.replace(/\D/g, '')}`, icon: MessageCircle, label: "WhatsApp" },
    { id: 'email', val: data.email, href: `mailto:${data.email}`, icon: Mail, label: "Email" },
    { id: 'map', val: data.mapUrl, href: data.mapUrl, icon: MapPin, label: "Visit Us" },
    { id: 'web', val: data.website, href: data.website, icon: Globe, label: "Website" },
  ].filter(item => !!item.val);

  return (
    <section className={cn("w-full py-16 space-y-16 transition-colors duration-500", theme.bg)}>
      
      {/* Primary Actions: Floating List */}
      <div className="px-4 md:px-6 max-w-xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          {actions.map((action, idx) => (
            <motion.a
              key={action.id}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "group relative w-full flex items-center justify-between p-5 border transition-all duration-300 shadow-sm hover:shadow-xl active:scale-[0.98]",
                theme.card,
                theme.border,
                ui.layout === "minimal" ? "rounded-2xl" : "rounded-[2.5rem]"
              )}
            >
              <div className="flex items-center gap-5 relative z-10">
                {/* Icon Container - Fix: Using theme.accentContent for visibility */}
                <div className={cn(
                  "h-14 w-14 flex items-center justify-center transition-all duration-500 shadow-md",
                  ui.layout === "minimal" ? "rounded-xl" : "rounded-3xl",
                  theme.accent,
                  theme.accentContent || "text-white"
                )}>
                  <action.icon className="h-6 w-6" />
                </div>

                <div className="text-left">
                  <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1", theme.text)}>
                    {action.label}
                  </p>
                  <p className={cn("text-base font-bold truncate max-w-[160px] sm:max-w-xs tracking-tight", theme.text)}>
                    {action.val}
                  </p>
                </div>
              </div>

              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1",
                theme.accent,
                theme.accentContent || "text-white"
              )}>
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Social Bar: Integrated Dock */}
      <div className="px-4">
        <div className={cn(
          "max-w-xl mx-auto py-10 px-8 border transition-all duration-500 relative overflow-hidden",
          theme.card,
          theme.border,
          ui.layout === "minimal" ? "rounded-3xl" : "rounded-[4rem]"
        )}>
          {/* Decorative background element */}
          <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl rounded-full", theme.accent)} />

          <div className="flex flex-col items-center gap-8 relative z-10">
            <div className="text-center">
              <h3 className={cn("text-xl font-black uppercase italic tracking-tighter", theme.text)}>
                Follow the <span className={cn("not-italic", theme.primary)}>Journey</span>
              </h3>
              <div className={cn("w-12 h-1 mx-auto mt-2 rounded-full", theme.accent)} />
            </div>

            <div className="flex flex-wrap justify-center gap-5">
              {Object.entries(data.socials || {}).map(([key, url]) => {
                if (!url) return null;
                const Icon = iconMap[key as keyof typeof iconMap];
                if (!Icon) return null;

                return (
                  <motion.a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -8, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "h-14 w-14 flex items-center justify-center transition-all border shadow-lg",
                      ui.layout === "minimal" ? "rounded-2xl" : "rounded-3xl",
                      theme.card,
                      theme.border,
                      theme.text,
                      // Dynamic hover state logic
                      `hover:shadow-2xl hover:border-transparent transition-colors`
                    )}
                    // We use inline style for the hover background to avoid string replacement issues
                    onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = 'var(--accent-color, currentColor)';
                        target.style.color = 'var(--accent-content, white)';
                    }}
                    onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = '';
                        target.style.color = '';
                    }}
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