import { useState, useEffect } from "react";
import GoogleFonts from '../components/ui/GoogleFonts';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import DashboardView from '../components/views/DashboardView';
import ApiKeysView from '../components/api-keys/ApiKeysView';
import IncidentsView from '../components/incidents/IncidentsView';
import TimelineView from '../components/timeline/TimelineView';
import ServicesView from '../components/services/ServicesView';
import AiInsightsView from '../components/ai/AiInsightsView';
import AlertsView from '../components/alerts/AlertsView';
import SettingsView from '../components/views/SettingsView';
import UsersView from '../components/views/UsersView';
import EmptyView from '../components/views/EmptyView';
import { NAV_ITEMS } from '../dashboard.constants';

/* ─── ROOT ─── */
export default function OpsPulseDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderView = () => {
    if (active === "dashboard") return <DashboardView />;
    if (active === "incidents") return <IncidentsView />;
    if (active === "services")  return <ServicesView />;
    if (active === "ai")        return <AiInsightsView />;
    if (active === "alerts")    return <AlertsView />;
    if (active === "timeline")  return <TimelineView />;
    if (active === "apikeys")   return <ApiKeysView />;
    if (active === "users")     return <UsersView />;
    if (active === "settings")  return <SettingsView />;
    const label = NAV_ITEMS.find(n => n.id === active)?.label || active;
    return <EmptyView title={label} />;
  };

  return (
    <>
      <GoogleFonts />
      <div className="flex h-screen bg-black text-white overflow-hidden">
        <Sidebar
          active={active}
          setActive={setActive}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 sm:py-6">
            {renderView()}
          </div>
        </div>
      </div>
    </>
  );
}