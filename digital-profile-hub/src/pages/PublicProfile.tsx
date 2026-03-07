import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/api";
import { themeRegistry } from "@/config/themeConfig";

// Components
import TermsLegalSection from "@/components/profile/TnC";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ServicesSection from "@/components/profile/ServicesSection";
import GallerySection from "@/components/profile/GallerySection";
import ProductsSection from "@/components/profile/ProductsSection";
import BlogsSection from "@/components/profile/BlogsSection";
import BusinessHours from "@/components/profile/BusinessHours";
import AppointmentBooking from "@/components/profile/AppointmentBooking";
import EnquiryForm from "@/components/profile/EnquiryForm";
import BottomContactBar from "@/components/profile/BottomContactBar";
import MapSection from "@/components/profile/MapSection";
import QRSection from "@/components/profile/QRSection";
import CartFloatingButton from "@/components/layout/CartFloatingButton";
import TestimonialSection from "@/components/profile/TestimonialSection";
// UI/Icons
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle } from "lucide-react";

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

 // --- DYNAMIC SELECTION ---
  // 1. Extract theme_id from profileData, fallback to "1" if loading or null
  const activeThemeId = profileData?.theme_id?.toString() || "1";
  
  // 2. Interface is still hardcoded for now, but you can follow the same pattern if you add interface_id to DB
  const activeInterfaceId = profileData?.interface_id?.toString() || "1"; 

  // 3. Look up the config from your registry using the dynamic ID
  const theme = themeRegistry.themes[activeThemeId as keyof typeof themeRegistry.themes] 
                || themeRegistry.themes["1"]; // Safety fallback
                
  const ui = themeRegistry.interfaces[activeInterfaceId as keyof typeof themeRegistry.interfaces] 
             || themeRegistry.interfaces["1"];
  // Helper for layout wrapping
  const layoutWrapperClass = ui.spacing;

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/profile/${username}`);
        const actualData = response.data.data || response.data;
        console.log(actualData)
        setProfileData(actualData);

        if (actualData?.id) localStorage.setItem(`profileId`, actualData.id.toString());
      } catch (err: any) {
        setError(err.response?.data?.message || "Profile not found");
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchFullProfile();
  }, [username]);

  if (loading) return (
    <div className={`flex h-screen w-full flex-col items-center justify-center ${theme.bg}`}>
      <Loader2 className={`h-10 w-10 animate-spin ${theme.primary}`} />
    </div>
  );

  if (error || !profileData) return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center bg-white">
      <AlertTriangle className="text-rose-500 h-12 w-12 mb-4" />
      <h1 className="text-xl font-bold">Profile Not Found</h1>
    </div>
  );

  return (
    
      <div className={`min-h-screen pb-24 transition-colors duration-500 ${theme.bg}`}>
        
        {/* Header - Always Full Width */}
        <ProfileHeader data={profileData} theme={theme}  ui={ui}/>
        
        <div className="p-4">
           <QRSection username={username!} theme={theme}  ui={ui}/>
        </div>

        <Separator className={theme.border} />

        {/* Dynamic Content Area based on Interface */}
        <div className={layoutWrapperClass}>
          {profileData.services?.length > 0 && (
            <ServicesSection services={profileData.services} theme={theme} ui={ui} />
          )}

          {profileData.products?.length > 0 && (
            <ProductsSection products={profileData.products} theme={theme} ui={ui} />
          )}
          
          {profileData.gallery?.length > 0 && (
            <GallerySection gallery={profileData.gallery} theme={theme} ui={ui} />
          )}
        </div>

        {/* Informational Sections */}
        <div className="space-y-6 mt-6">
          {profileData.blogs?.length > 0 && <BlogsSection blogs={profileData.blogs} theme={theme}  ui={ui}/>}
          {profileData.business_hours && <BusinessHours data={profileData.business_hours} theme={theme} ui={ui} />}
          
          <div className="px-4 space-y-8">
            <AppointmentBooking profileId={profileData.id} theme={theme}  ui={ui}/>
            <EnquiryForm profileId={profileData.id} theme={theme}  ui={ui}/>
          </div>
        </div>
        <TestimonialSection testimonials={profileData.testimonials} theme={theme}  ui={ui}/>
        <MapSection profile={profileData} theme={theme}  ui={ui}/>

        <TermsLegalSection data={profileData.legal_documents} theme={theme} ui={ui}/>
        <CartFloatingButton/>
        <BottomContactBar profile={profileData} theme={theme}  ui={ui}/>
      </div>
  );
};

export default PublicProfile;