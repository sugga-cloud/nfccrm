import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import AdminAnalytics from "@/components/admin/tabs/AdminAnalytics";
import ProfilesList from "@/components/admin/tabs/ProfilesList";
import PlansTab from "@/components/admin/tabs/PlansTab";
import PaymentsTab from "@/components/admin/tabs/PaymentsTab";
// import ToggleTab from "@/components/admin/tabs/ToggleTab";
import UsersTab from "@/components/admin/tabs/UsersTab";
import StorageTab from "@/components/admin/tabs/StorageTab";
import CreateProfile from "@/components/admin/tabs/CreateProfile";
import CreateStaff from "@/components/admin/tabs/CreateStaff";

const sidebarItems = [
  { label: "Analytics", value: "analytics" },
  { label: "Manage Profiles", value: "profiles" },
  { label: "Subscription Plans", value: "plans" },
  { label: "Payment Tracking", value: "payments" },
  // { label: "Activate / Deactivate", value: "toggle" },
  { label: "User Management", value: "users" },
  { label: "Storage Monitoring", value: "storage" },
  { label: "Create Profile", value: "create" },
  { label: "Create Staff", value: "staff" },
];

const Admin = () => {
  const [tab, setTab] = useState("analytics");

  // read query params on mount to support deep links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qtab = params.get("tab");
    if (qtab) {
      setTab(qtab);
    }
  }, []);

  return (
    <DashboardShell items={sidebarItems} activeTab={tab} onTabChange={setTab} title="Admin Panel">
      {tab === "analytics" && <AdminAnalytics />}
      {tab === "profiles" && <ProfilesList />}
      {tab === "plans" && <PlansTab />}
      {tab === "payments" && <PaymentsTab />}
      {/* {tab === "toggle" && <ToggleTab />} */}
      {tab === "users" && <UsersTab />}
      {tab === "storage" && <StorageTab />}
      {tab === "create" && <CreateProfile />}
      {tab === "staff" && <CreateStaff />}
    </DashboardShell>
  );
};

export default Admin;