import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QRSectionProps {
  username: string;
  profileImage?: string; // Optional: To place in the center of the QR
  theme?: "emerald" | "slate";
}

const QRSection = ({ username, profileImage, theme = "emerald" }: QRSectionProps) => {
  const profileUrl = `${window.location.origin}/profile/${username}`;

  // Darker professional colors matching our new ProfileHeader
  const themeClasses = {
    emerald: "[--qr-text:#2D6A4F] [--qr-accent:#40916C]",
    slate: "[--qr-text:#1E293B] [--qr-accent:#334155]",
  };

  return (
    <section className={cn("py-12 bg-white flex flex-col items-center", themeClasses[theme])}>
      {/* Section Title - Matches "QR Code" header in Screenshot 2/3 */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-6"
      >
        <h2 className="text-xl font-bold text-slate-800">QR Code</h2>
        <div className="w-10 h-1 bg-[var(--qr-accent)] mx-auto mt-1 rounded-full" />
      </motion.div>

      {/* QR Card Container */}
      <div className="relative group">
        {/* Subtle decorative shadow behind the QR */}
        <div className="absolute -inset-4 bg-slate-50 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-transform duration-500" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100"
        >
          {/* Branded Icon on top of QR as seen in screenshots */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 p-2 rounded-full border-4 border-white shadow-md">
            <QrCode className="w-5 h-5 text-white" />
          </div>

          <div className="bg-white rounded-xl overflow-hidden">
            <QRCodeSVG
              value={profileUrl}
              size={180}
              level={"H"}
              includeMargin={false}
              // UnoGreen style often has the brand logo in center
              imageSettings={profileImage ? {
                src: profileImage,
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              } : undefined}
            />
          </div>
        </motion.div>
      </div>

      {/* Action Prompt */}
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-slate-400 text-xs font-medium uppercase tracking-widest"
      >
        Scan to save contact
      </motion.p>
    </section>
  );
};

export default QRSection;