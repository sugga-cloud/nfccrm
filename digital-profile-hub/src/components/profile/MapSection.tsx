import { MapPin, Navigation, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MapSectionProps {
  profile: any;
}

const MapSection = ({ profile }: MapSectionProps) => {
  const address = profile.address || "New York, NY";
  
  // Clean address for URL
  const encodedAddress = encodeURIComponent(address);
  
  // Standard Embed URL (No API Key required)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  
  // External link for the "Directions" button
  const googleMapUrl = profile.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  };

  return (
    <section className="w-full py-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-2 mb-1">
             <MapPin className="h-4 w-4 text-orange-500" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Find Us</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Our Location</h2>
          <div className="w-10 h-1 bg-orange-500 mt-1.5 rounded-full" />
        </div>

        {/* Map Frame */}
        <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl bg-slate-100 aspect-square md:aspect-video">
          
          {/* DARK MODE TRICK: 
            We use a combination of grayscale and invert filters to turn the 
            standard light map into a dark theme map without an API key.
          */}
          <iframe
            title="Location Map"
            className="absolute inset-0 w-full h-full grayscale invert-[0.9] contrast-[1.2] opacity-90"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapEmbedUrl}
          ></iframe>

          {/* Overlay Content */}
          <div className="absolute inset-x-4 bottom-4">
            <div className="bg-slate-900/95 backdrop-blur-md p-5 rounded-[2rem] border border-slate-800 shadow-2xl">
              <h3 className="text-white font-bold text-sm mb-4 line-clamp-2">
                {address}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => window.open(googleMapUrl, '_blank')}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-11 font-bold text-xs gap-2"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Directions
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={copyAddress}
                  className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl h-11 font-bold text-xs gap-2"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Top Right External Link Button */}
          <button 
            onClick={() => window.open(googleMapUrl, '_blank')}
            className="absolute top-4 right-4 h-10 w-10 bg-slate-900/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white active:scale-90 transition-transform"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MapSection;