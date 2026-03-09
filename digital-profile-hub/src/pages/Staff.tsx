import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import ProfilesList from "@/components/admin/tabs/ProfilesList";
import CreateProfile from "@/components/admin/tabs/CreateProfile";

const sidebarItems = [
  { label: "Manage Profiles", value: "profiles" },
  { label: "Create Profile", value: "create" },
];

const Staff = () => {
  const [tab, setTab] = useState("profiles");

  // Support deep links like /staff?tab=create&profileId=123
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qtab = params.get("tab");
    if (qtab) {
      setTab(qtab);
    }
  }, []);

  return (
    <DashboardShell
      items={sidebarItems}
      activeTab={tab}
      onTabChange={setTab}
      title="Staff Panel"
    >
      {tab === "profiles" && <ProfilesList />}
      {tab === "create" && <CreateProfile />}
    </DashboardShell>
  );
};

export default Staff;

