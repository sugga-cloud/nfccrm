import { motion } from "framer-motion";
import { QrCode, Download, ScanLine } from "lucide-react";
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

  // Layout-specific styling mapping
  const layouts = {
    classic: { card: "rounded-none border-4", inner: "rounded-none", button: "rounded-none", glow: "hidden" },
    modern: { card: "rounded-[3.5rem] border-2", inner: "rounded-[2rem]", button: "rounded-2xl", glow: "block" },
    glass: { card: "rounded-[2.5rem] backdrop-blur-xl bg-white/5 border-white/20", inner: "rounded-3xl", button: "rounded-xl", glow: "block" },
    minimal: { card: "rounded-3xl border-none shadow-none bg-secondary/5", inner: "rounded-2xl", button: "rounded-xl", glow: "hidden" },
    bento: { card: "rounded-[2.5rem] border-2", inner: "rounded-[1.5rem]", button: "rounded-2xl", glow: "block" },
  };

  const style = layouts[ui.id as keyof typeof layouts] || layouts.modern;

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
    <section className={cn("py-20 flex flex-col items-center transition-all duration-500", theme.bg, ui.spacing)}>
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "flex flex-col mb-12",
          ui.id === "minimal" ? "items-start px-8 w-full max-w-xl" : "items-center text-center"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
            <QrCode className={cn("w-4 h-4", theme.primary)} />
            <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-50", theme.text)}>
              Scan & Connect
            </span>
        </div>
        <h2 className={cn("text-2xl font-bold tracking-tight", theme.text)}>
          Digital QR Card
        </h2>
        {ui.id !== "minimal" && <div className={cn("w-12 h-1 mt-3 rounded-full", theme.accent)} />}
      </motion.div>

      {/* QR Container Wrapper */}
      <div className="relative group">
        {/* Themed Glow Effect */}
        <div className={cn(
          "absolute -inset-8 blur-3xl opacity-10 group-hover:opacity-25 transition-all duration-700 rounded-full",
          theme.accent, style.glow
        )} />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className={cn(
            "relative p-8 md:p-12 shadow-2xl transition-all duration-500",
            style.card,
            ui.id !== "minimal" ? (theme.card + " " + theme.border) : ""
          )}
        >
          {/* Action Button */}
          <button 
            onClick={downloadQR}
            className={cn(
              "absolute -top-5 right-8 p-3 shadow-xl transition-all hover:scale-110 active:scale-95 border z-10",
              theme.accent, theme.accentContent || "text-white", style.button,
              "border-white/10"
            )}
          >
            <Download className="w-4 h-4" />
          </button>

          {/* QR White Base - Essential for Scannability */}
          <div className={cn(
            "bg-white p-5 shadow-inner flex items-center justify-center relative",
            style.inner
          )}>
            <QRCodeSVG
              ref={qrRef}
              value={profileUrl}
              size={180}
              level={"H"}
              includeMargin={false}
              // Ensures high contrast for scanners regardless of UI theme
              fgColor="#000000"
              imageSettings={profileImage ? {
                src: profileImage,
                x: undefined, y: undefined,
                height: 40, width: 40,
                excavate: true,
              } : undefined}
            />
            
            {/* Corner Decorative Elements for Bento/Modern */}
            {(ui.id === "modern" || ui.id === "bento") && (
              <ScanLine className="absolute top-2 left-2 w-4 h-4 opacity-10 text-black" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer Instructions */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <p className={cn("text-[9px] font-bold uppercase tracking-[0.3em] opacity-30", theme.text)}>
          Scan to save contact details
        </p>
        <div className={cn("mt-4 px-4 py-1.5 rounded-full border text-[10px] font-medium opacity-40 inline-block", theme.border, theme.text)}>
          {profileUrl.replace(/^https?:\/\//, '')}
        </div>
      </motion.div>
    </section>
  );
};

export default QRSection;