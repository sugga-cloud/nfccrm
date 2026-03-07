import { MapPin, Navigation, Copy, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MapSectionProps {
  profile: any;
  theme: any; 
  ui: any;    
}

const MapSection = ({ profile, theme, ui }: MapSectionProps) => {
  const address = profile.address || "New York, NY";
  const encodedAddress = encodeURIComponent(address);
  
  // Fixed Template Literals
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const googleMapUrl = profile.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  
  /**
   * Google Review Link Logic
   * If you have a specific Place ID, use: https://search.google.com/local/writereview?placeid=YOUR_ID
   * Otherwise, we search for the address/business name and trigger the review intent.
   */
  const googleReviewUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}&query_place_id=${profile.google_place_id || ''}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  const isDarkTheme = 
    theme.bg?.includes('black') || 
    theme.bg?.includes('slate-950') || 
    theme.bg?.includes('zinc-950') ||
    theme.name === "Pure Dark";

  return (
    <section className={cn("w-full py-16 px-4 transition-colors duration-500", theme.bg)}>
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className={cn(
          "flex flex-col mb-10",
          ui.layout === "minimal" ? "items-start text-left" : "items-center text-center"
        )}>
          <div className="flex items-center gap-2 mb-2">
             <MapPin className={cn("h-4 w-4", theme.primary)} />
             <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] opacity-50", theme.text)}>
               Location
             </span>
          </div>
          <h2 className={cn("text-2xl font-black italic uppercase tracking-tighter", theme.text)}>Visit Our Space</h2>
          <div className={cn("w-12 h-1.5 mt-2 rounded-full", theme.accent)} />
        </div>

        {/* Map Frame Container */}
        <div className={cn(
          "relative overflow-hidden border shadow-2xl transition-all duration-700 aspect-square md:aspect-[16/10] mb-6",
          ui.layout === "minimal" ? "rounded-3xl" : "rounded-[3rem]",
          theme.border,
          isDarkTheme ? "bg-zinc-900" : "bg-zinc-100"
        )}>
          
          <iframe
            title="Location Map"
            className={cn(
              "absolute inset-0 w-full h-full transition-all duration-1000",
              isDarkTheme 
                ? "grayscale invert-[0.92] contrast-[1.1] brightness-[0.9] opacity-70" 
                : "grayscale-[0.1] opacity-90"
            )}
            frameBorder="0"
            scrolling="no"
            src={mapEmbedUrl}
          ></iframe>

          <button 
            onClick={() => window.open(googleMapUrl, '_blank')}
            className={cn(
              "absolute top-5 right-5 h-12 w-12 backdrop-blur-xl rounded-full flex items-center justify-center border transition-all hover:scale-110 active:scale-90 z-20 shadow-xl",
              theme.card,
              theme.border,
              theme.text
            )}
          >
            <ExternalLink className="h-5 w-5 opacity-70" />
          </button>

          {/* Floating Address Overlay */}
          <div className="absolute inset-x-5 bottom-5 z-20">
            <div className={cn(
              "backdrop-blur-xl p-6 border shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all",
              ui.layout === "minimal" ? "rounded-2xl" : "rounded-[2.2rem]",
              theme.card,
              theme.border,
              "bg-opacity-80"
            )}>
              <div className="flex items-start gap-4 mb-5">
                <div className={cn("mt-1 p-2 rounded-lg bg-opacity-10", theme.accent.replace('bg-', 'bg-'))}>
                    <MapPin className={cn("h-4 w-4", theme.primary)} />
                </div>
                <h3 className={cn("font-bold text-sm leading-relaxed", theme.text)}>
                  {address}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => window.open(googleMapUrl, '_blank')}
                  className={cn(
                    "rounded-xl h-12 font-black uppercase tracking-widest text-[10px] gap-2 transition-all shadow-lg active:scale-95",
                    theme.accent,
                    theme.accentContent || "text-white"
                  )}
                >
                  <Navigation className="h-4 w-4" />
                  Route
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={copyAddress}
                  className={cn(
                    "bg-transparent rounded-xl h-12 font-black uppercase tracking-widest text-[10px] gap-2 transition-all active:scale-95 border-2",
                    theme.border,
                    theme.text
                  )}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;