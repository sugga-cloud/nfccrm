import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";

// Import your new tab components
import AnalyticsTab from "@/components/dashboard/tabs/AnalyticsTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import CrudTable from "@/components/dashboard/tabs/CrudTable";
import EnquiriesTab from "@/components/dashboard/tabs/EnquiriesTab";
import AppointmentsTab from "@/components/dashboard/tabs/AppointmentsTab";
import MediaTab from "@/components/dashboard/tabs/MediaTab";
import QRTab from "@/components/dashboard/tabs/QRTab";
import BusinessHoursTab from "@/components/dashboard/tabs/BusinessHoursTab";
import SocialLinksTab from "@/components/dashboard/tabs/SocialLinksTab";
import AdminThemeSelector from "@/components/dashboard/tabs/LayoutTab";
import Testimonial from "@/components/dashboard/tabs/Testimonial";
import TermsAndConditionsTab from "@/components/dashboard/tabs/TermsAndConditionsTab";
import ReviewQRTab from "@/components/dashboard/tabs/ReviewTab";
const sidebarItems = [
  { label: "Analytics", value: "analytics" },
  { label: "Edit Profile", value: "profile" },
  { label: "Social Links", value: "socials" }, // Added
  { label: "Business Hours", value: "hours" }, // Added
  { label: "Upload Media", value: "media" },
  { label: "Manage Services", value: "services" },
  { label: "Manage Products", value: "products" },
  { label: "Manage Blogs", value: "blogs" },
  { label: "Google Review", value: "review" },
  { label: "Terms & Conditions", value: "tnc" },
  { label: "View Enquiries", value: "enquiries" },
  {label: "Manage Testimonials", value: "testimonials"},
  { label: "View Appointments", value: "appointments" },
  { label: "Layout and Theme", value: "theme" },
  { label: "Download QR", value: "qr" },
];

const Dashboard = () => {
  const [tab, setTab] = useState("analytics");

  return (
    <DashboardShell
      items={sidebarItems}
      activeTab={tab}
      onTabChange={setTab}
      title="Dashboard"
    >
      {tab === "analytics" && <AnalyticsTab />}
      {tab === "profile" && <ProfileTab />}
      {tab === "socials" && <SocialLinksTab />} {/* Added */}
      {tab === "hours" && <BusinessHoursTab />} {/* Added */}
      {tab === "media" && <MediaTab />}
      {tab === "services" && <CrudTable title="Services" endpoint="/services" />}
      {tab === "products" && <CrudTable title="Products" endpoint="/products" />}
      {tab === "blogs" && <CrudTable title="Blogs" endpoint="/blogs" />}
      {tab === "enquiries" && <EnquiriesTab />}
      {tab === "testimonials" && <Testimonial />}
      {tab === "review" && <ReviewQRTab />}
      {tab === "tnc" && <TermsAndConditionsTab />}
      {tab === "appointments" && <AppointmentsTab />}
      {tab === "theme" && <AdminThemeSelector/>}
      {tab === "qr" && <QRTab />}
    </DashboardShell>
  );
};

export default Dashboard;