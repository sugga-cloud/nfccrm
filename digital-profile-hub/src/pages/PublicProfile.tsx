import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/api";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ContactSocial from "@/components/profile/ContactSocial";
import QRSection from "@/components/profile/QRSection";
import ServicesSection from "@/components/profile/ServicesSection";
import GallerySection from "@/components/profile/GallerySection";
import ProductsSection from "@/components/profile/ProductsSection";
import BlogsSection from "@/components/profile/BlogsSection";
import BusinessHours from "@/components/profile/BusinessHours";
import AppointmentBooking from "@/components/profile/AppointmentBooking";
import EnquiryForm from "@/components/profile/EnquiryForm";
import BottomContactBar from "@/components/profile/BottomContactBar";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle } from "lucide-react";
import CartFloatingButton from "@/components/layout/CartFloatingButton";
import MapSection from "@/components/profile/MapSection";
const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/profile/${username}`);
        
        // --- THE FIX: Handle different response structures ---
        // If Laravel returns { status: 'success', data: {...} }
        const actualData = response.data.data || response.data;
        
        setProfileData(actualData);
        console.log(actualData)
        // Use actualData.id because response.data might be the wrapper
        if (actualData?.id) {
          localStorage.setItem(`profileId`, actualData.id.toString());
        }

      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Profile not found");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchFullProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="mt-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Loading Profile...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
           <AlertTriangle className="text-rose-500 h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Profile Not Found</h1>
        <p className="text-slate-500 max-w-xs mt-2 text-sm font-medium">
          The digital card for <span className="text-orange-500">@{username}</span> doesn't exist or has been deactivated.
        </p>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* 1. Header & Bio (Pass the whole object or just the profile part) */}
      <ProfileHeader data={profileData} />
      
      {/* 2. Contact Buttons & Social Links */}
      {/* Use optional chaining to prevent crash if 'profile' key is missing */}
      {/* <ContactSocial data={profileData} /> 
       */}
      <Separator className="opacity-50" />

      {/* 3. Dynamic QR Code */}
      <QRSection username={username!} />

      {/* 4. Business Services */}
      {profileData.services?.length > 0 && (
        <>
          <Separator className="opacity-50" />
          <ServicesSection services={profileData.services} />
        </>
      )}

      {/* 5. Media Gallery */}
      {profileData.gallery?.length > 0 && (
        <>
          <Separator className="opacity-50" />
          <GallerySection gallery={profileData.gallery} />
        </>
      )}

      {/* 6. Product Catalog */}
      {profileData.products?.length > 0 && (
        <>
          <Separator className="opacity-50" />
          <ProductsSection products={profileData.products} />
        </>
      )}

      {/* 7. Blog Posts */}
      {profileData.blogs?.length > 0 && (
        <>
          <Separator className="opacity-50" />
          <BlogsSection blogs={profileData.blogs} />
        </>
      )}

      {/* 8. Working Hours */}
      {profileData.business_hours && (
        <>
          <Separator className="opacity-50" />
          <BusinessHours data={profileData.business_hours} />
        </>
      )}

      <CartFloatingButton />

      {/* 9. Interactions */}
      <Separator className="opacity-50" />
      <div className="pb-24"> {/* Space for Bottom Bar */}
        <AppointmentBooking profileId={profileData.id} />
        <Separator className="my-8 opacity-50" />
        <EnquiryForm profileId={profileData.id} />
      </div>
      <MapSection profile={profileData}/>
      {/* 10. Sticky Mobile Bar */}
      <BottomContactBar profile={profileData} />
    </MainLayout>
  );
};

export default PublicProfile;