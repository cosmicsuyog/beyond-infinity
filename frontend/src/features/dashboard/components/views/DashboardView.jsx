import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  fetchDashboardStats,
  fetchIncidentTrends,
  fetchIncidents,
  fetchHealthData,
  fetchSystemData,
} from "../../dashboard.slice";
import { useDashboardData } from "../../hooks/useDashboardData";
import { CHART_DATA, INCIDENTS, SERVICES } from "../../dashboard.constants";
import PageHeader from "../ui/PageHeader";
import GhostBtn from "../ui/GhostBtn";
import CreateIncidentModal from "../incidents/CreateIncidentModal";
import { useIncidents } from "../incidents/useIncidents";

// Extracted Sub-components
import StatCards from "../dashboard/StatCards";
import ActiveIncidents from "../dashboard/ActiveIncidents";
import SystemHealth from "../dashboard/SystemHealth";
import SystemMetrics from "../dashboard/SystemMetrics";
import IncidentChart from "../dashboard/IncidentChart";
import AiInsight from "../dashboard/AiInsight";

const DashboardView = () => {
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { createIncident } = useIncidents({ skipFetch: true });

  const {
    statCards,
    incidents: liveIncidents,
    services: liveServices,
    chartData: liveChartData,
    system,
    topResponders,
    errorsLast24h,
    loadingStats,
    loadingIncidents,
    loadingHealth,
    loadingTrends,
    loadingSystem,
    isLoading,
  } = useDashboardData();

  /* Use live data when available, fall back to constants */
  const incidents  = liveIncidents.length  > 0 ? liveIncidents  : INCIDENTS;
  const services   = liveServices.length   > 0 ? liveServices   : SERVICES;
  const chartData  = liveChartData.length  > 0 ? liveChartData  : CHART_DATA;

  /* Refresh all data */
  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchIncidentTrends(7));
    dispatch(fetchIncidents({ limit: 10, status: "open" }));
    dispatch(fetchHealthData());
    dispatch(fetchSystemData());
  };

  const handleCreateIncident = async (data) => {
    const result = await createIncident(data);
    if (result.success) {
      handleRefresh(); 
    }
    return result;
  };

  return (
    <>
      <PageHeader title="DASHBOARD" subtitle="Overview of system health and incident status">
        <GhostBtn onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={10} className="inline mr-1.5 align-middle" />
          NEW INCIDENT
        </GhostBtn>
        <GhostBtn onClick={handleRefresh}>
          <RefreshCw size={10} className={`inline mr-1.5 align-middle ${isLoading ? "animate-spin" : ""}`} />
          REFRESH
        </GhostBtn>
      </PageHeader>

      <CreateIncidentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateIncident}
      />

      {/* ── TOP STATS ── */}
      <StatCards cards={statCards} loading={loadingStats} />

      {/* ── MIDDLE ROW ── */}
      <div className="fade-up fade-up-2 grid grid-cols-1 xl:grid-cols-[1fr_270px] gap-3 mb-3.5">
        <ActiveIncidents incidents={incidents} loading={loadingIncidents} />
        <SystemHealth services={services} loading={loadingHealth} />
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="fade-up fade-up-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[auto_1fr_240px] gap-3">
        <SystemMetrics system={system} loading={loadingSystem} />
        <IncidentChart chartData={chartData} loading={loadingTrends} />
        <AiInsight 
          topResponders={topResponders} 
          errorsLast24h={errorsLast24h} 
          statCards={statCards} 
        />
      </div>
    </>
  );
};

export default DashboardView;
