import { motion } from "framer-motion";
import { Download, Link as LinkIcon, Check, QrCode, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QRSectionProps {
  username: string;
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose";
}

const QRSection = ({ username, theme = "orange" }: QRSectionProps) => {
  const qrRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/${username}`;

  // Theme mapping consistent with ProfileHeader
  const themeClasses = {
    orange: "[--qr-primary:#f97316] [--qr-bg:theme(colors.orange.50)]",
    blue: "[--qr-primary:#3b82f6] [--qr-bg:theme(colors.blue.50)]",
    purple: "[--qr-primary:#a855f7] [--qr-bg:theme(colors.purple.50)]",
    emerald: "[--qr-primary:#10b981] [--qr-bg:theme(colors.emerald.50)]",
    rose: "[--qr-primary:#f43f5e] [--qr-bg:theme(colors.rose.50)]",
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // Add padding for a cleaner look in the PNG
      const padding = 40;
      canvas.width = img.width + padding;
      canvas.height = img.height + padding;
      
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding / 2, padding / 2);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${username}-nfc-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <section className={cn("container py-12", themeClasses[theme])}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[var(--qr-bg)] text-[var(--qr-primary)] mb-3">
          <QrCode className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
          Share Your <span className="text-[var(--qr-primary)]">Profile</span>
        </h2>
      </motion.div>

      <Card className="mx-auto max-w-sm border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="flex flex-col items-center gap-6 p-8">
          
          {/* QR Code Container */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative p-4 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200"
          >
            <div className="bg-white p-3 rounded-2xl shadow-inner">
              <QRCodeSVG
                value={profileUrl}
                size={200}
                level={"H"}
                includeMargin={false}
                ref={qrRef}
                fgColor="currentColor"
                className="text-slate-900"
              />
            </div>
          </motion.div>

          {/* URL Box */}
          <div className="w-full space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Profile URL</p>
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 group">
              <p className="flex-1 text-[11px] font-bold text-slate-600 truncate pl-2 italic">
                {profileUrl}
              </p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg hover:bg-[var(--qr-bg)] hover:text-[var(--qr-primary)]"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              className="bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest h-11 gap-2 shadow-lg"
              onClick={downloadQR}
            >
              <Download className="h-4 w-4" /> PNG
            </Button>
            
            <Button 
              variant="outline" 
              className="border-slate-200 hover:border-[var(--qr-primary)] hover:text-[var(--qr-primary)] rounded-xl font-bold text-xs uppercase tracking-widest h-11 gap-2"
              onClick={() => window.print()}
            >
              <FileType className="h-4 w-4" /> Print
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default QRSection;