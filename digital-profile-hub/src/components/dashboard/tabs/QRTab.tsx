import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Share2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const QRTab = () => {
  // 1. Cached Data Fetching with React Query
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"], // This unique key handles the caching
    queryFn: async () => {
      const res = await api.get("/my-profile");
      return res.data.profile;
    },
    staleTime: 1000 * 60 * 10, // Data remains "fresh" for 10 minutes
  });

  const publicUrl = profile?.username 
    ? `${window.location.origin}/${profile.username}`
    : window.location.origin;

  // 2. Optimized PNG Download Logic
  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000; // High resolution for printing
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "white"; // Ensure background is white, not transparent
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1000, 1000);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${profile?.username || 'business'}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("High-res QR Downloaded");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-brand-gold" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">QUICK RESPONSE</h1>
          <p className="text-slate-400 font-medium">Your digital storefront, one scan away.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-xl border-white/10 font-bold hover:bg-brand-gold/20 text-slate-400"
          onClick={() => window.open(publicUrl, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4 text-brand-gold" /> 
          Live Preview
        </Button>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] rounded-[3rem] overflow-hidden bg-white/5">
          <div className="h-3 bg-brand-gold" />
          
          <CardContent className="flex flex-col items-center gap-8 p-10">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {profile?.business_name || "Official Profile"}
              </h2>
              <p className="text-brand-gold text-[10px] font-black tracking-[0.4em] mt-1 uppercase">Scan to Connect</p>
            </div>

            {/* Locally Generated QR Code */}
            <div className="relative p-6 bg-white/5 rounded-[2.5rem] border border-white/10">
              <QRCodeSVG
                id="qr-code-svg"
                value={publicUrl}
                size={240}
                level={"H"}
                includeMargin={false}
              />
            </div>

            <div className="w-full space-y-4">
              {/* URL Display */}
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <LinkIcon className="h-4 w-4 text-brand-gold" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 truncate">{publicUrl}</span>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-[10px] font-black text-brand-gold hover:bg-brand-gold/20 h-8 rounded-lg px-3"
                  onClick={() => {
                      navigator.clipboard.writeText(publicUrl);
                      toast.success("Link copied!");
                  }}
                >
                  COPY
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={downloadQRCode}
                  className="flex-1 bg-brand-gold hover:bg-brand-accent text-brand-dark rounded-2xl h-14 font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  <Download className="mr-2 h-5 w-5" /> Download
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: profile?.business_name, url: publicUrl });
                    } else {
                      toast.info("Share API not supported on this browser");
                    }
                  }}
                  className="rounded-2xl h-14 w-14 border-white/10 flex items-center justify-center p-0 hover:bg-white/10"
                >
                  <Share2 className="h-5 w-5 text-slate-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Secure Local Generation • Cached Profile Data
        </p>
      </div>
    </div>
  );
};

export default QRTab;