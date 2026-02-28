import { motion } from "framer-motion";
import { QrCode, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface QRSectionProps {
  username: string;
  profileImage?: string;
  theme: any; 
  ui: any;
}

const QRSection = ({ username, profileImage, theme, ui }: QRSectionProps) => {
  const profileUrl = `${window.location.origin}/profile/${username}`;
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${username}_qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <section className={cn(
      "py-20 flex flex-col items-center transition-colors duration-500", 
      theme.bg
    )}>
      {/* Section Title */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
            <QrCode className={cn("w-4 h-4", theme.primary)} />
            <h2 className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>
            Scan & Connect
            </h2>
        </div>
        <h2 className={cn("text-2xl font-black italic uppercase tracking-tighter", theme.text)}>
          Digital QR Card
        </h2>
        <div className={cn("w-12 h-1.5 mx-auto mt-3 rounded-full", theme.accent)} />
      </motion.div>

      {/* QR Card Container */}
      <div className="relative group">
        {/* Glow Effect - Adapts to Theme Accent */}
        <div className={cn(
          "absolute -inset-6 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-700",
          theme.accent
        )} />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className={cn(
            "relative p-10 shadow-2xl border-2 transition-all duration-700",
            ui.layout === "minimal" ? "rounded-[2rem]" : "rounded-[3.5rem]",
            theme.card,
            theme.border
          )}
        >
          {/* Action Badge */}
          <button 
            onClick={downloadQR}
            className={cn(
              "absolute -top-6 left-1/2 -translate-x-1/2 p-3 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-90 border-2 z-10",
              theme.accent,
              theme.accentContent || "text-white",
              "border-transparent"
            )}
          >
            <Download className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <div className="bg-white p-4 rounded-[1.5rem] shadow-inner overflow-hidden flex items-center justify-center">
            <QRCodeSVG
              ref={qrRef}
              value={profileUrl}
              size={200}
              level={"H"}
              includeMargin={false}
              // Dark themes get black QR modules, light themes get theme-colored modules
              fgColor={theme.name === "Pure Dark" ? "#000000" : "#111827"}
              imageSettings={profileImage ? {
                src: profileImage,
                x: undefined,
                y: undefined,
                height: 48,
                width: 48,
                excavate: true,
              } : undefined}
            />
          </div>
        </motion.div>
      </div>

      {/* Branding / Footer Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 text-center space-y-2"
      >
        <p className={cn(
          "text-[10px] font-black uppercase tracking-[0.4em] opacity-30",
          theme.text
        )}>
          Point camera to save
        </p>
        <p className={cn("text-[9px] font-bold opacity-20", theme.text)}>
          {profileUrl.replace('https://', '')}
        </p>
      </motion.div>
    </section>
  );
};

export default QRSection;