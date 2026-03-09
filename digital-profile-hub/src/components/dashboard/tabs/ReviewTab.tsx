import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Share2, Star, MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
const ReviewQRTab = () => {
  const [reviewUrl, setReviewUrl] = useState<string>("");
  const [isOptimized, setIsOptimized] = useState<boolean>(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await api.get("/my-profile");
      return res.data.profile;
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!isLoading && profile) {
      const mapLink = profile.google_map_link;

      if (!mapLink) {
        toast.error("Google Map link missing!", {
          description: "Please update your map link in the Profile section first.",
        });
        return;
      }

      // 1. Try to find Place ID (ChIJ...)
      const placeIdMatch = mapLink.match(/ChIJ[a-zA-Z0-9_-]{23}/);
      
      // 2. Try to find CID (Another way Google identifies places)
      const cidMatch = mapLink.match(/cid=(\d+)/);

      if (placeIdMatch) {
        setReviewUrl(`https://search.google.com/local/writereview?placeid=${placeIdMatch[0]}`);
        setIsOptimized(true);
      } else if (cidMatch) {
        // Fallback to CID-based review link if Place ID isn't in URL
        setReviewUrl(`https://search.google.com/local/writereview?placeid=${cidMatch[1]}`);
        setIsOptimized(true);
      } else {
        // If it's a short link (goo.gl), we can't extract the ID client-side
        // We use the original link but warn the user
        setReviewUrl(mapLink);
        setIsOptimized(false);
      }
    }
  }, [profile, isLoading]);
  const downloadQRCode = () => {
    const svg = document.getElementById("review-qr-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1000, 1000);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `google-review-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("Review QR Code Downloaded");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
    </div>
  );

  if (!profile?.google_map_link) {
      return (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <MapPin className="h-12 w-12 text-slate-300" />
              <p className="text-slate-500 font-medium">Map Link not configured.</p>
              <Button variant="link" className="text-brand-gold font-bold uppercase tracking-tighter">Go to Profile Settings</Button>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Review Booster</h1>
          <p className="text-slate-400 font-medium">Get 5-star reviews directly on Google Maps.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-xl border-white/10 font-bold hover:bg-brand-gold/20 text-slate-400"
          onClick={() => window.open(reviewUrl, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4 text-brand-gold" /> 
          Test Review Link
        </Button>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] rounded-[3rem] overflow-hidden bg-white/5">
          <div className="h-3 bg-brand-gold" />
          
          <CardContent className="flex flex-col items-center gap-8 p-10">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {profile?.business_name || "Leave a Review"}
              </h2>
              <p className="text-brand-gold text-[10px] font-black tracking-[0.4em] mt-1 uppercase italic">Your feedback matters</p>
            </div>

            <div className="relative p-6 bg-white/5 rounded-[2.5rem] border border-white/10">
              <QRCodeSVG
                id="review-qr-svg"
                value={reviewUrl}
                size={240}
                level={"H"}
                includeMargin={false}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/5 p-2 rounded-full border border-white/10">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  </div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex gap-3">
                <Button 
                  onClick={downloadQRCode}
                  className="flex-1 bg-brand-gold hover:bg-brand-accent text-brand-dark rounded-2xl h-14 font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  <Download className="mr-2 h-5 w-5" /> Save PNG
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: `Review ${profile?.business_name}`, url: reviewUrl });
                    } else {
                      navigator.clipboard.writeText(reviewUrl);
                      toast.success("Link copied to clipboard!");
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
          Optimized for Google Business Reviews • Instant Write-Review Trigger
        </p>
      </div>
    </div>
  );
};

export default ReviewQRTab;