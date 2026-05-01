import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchIncidentTrends,
  fetchIncidents,
  fetchHealthData,
  fetchSystemData,
} from "../dashboard.slice";

// Avatar color palette for assignees (cycles by index)
const AVATAR_COLORS = [
  "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#818cf8",
  "#ec4899", "#14b8a6", "#f97316",
];

// Map service name → icon name used in DashboardView's iconMap
const SERVICE_ICON_MAP = {
  "payment": "CreditCard",
  "payment-service": "CreditCard",
  "database": "Database",
  "db": "Database",
  "auth": "Shield",
  "auth-service": "Shield",
  "authentication": "Shield",
  "api": "Monitor",
  "api-service": "Monitor",
  "frontend": "Monitor",
};

// Pick best icon for a service name
function resolveIcon(serviceName = "") {
  const lower = serviceName.toLowerCase();
  for (const [key, icon] of Object.entries(SERVICE_ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return "Monitor";
}

// Pick a stable color for a service based on its name chars
const SERVICE_COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#818cf8", "#ec4899"];
function resolveServiceColor(serviceName = "") {
  let sum = 0;
  for (let i = 0; i < serviceName.length; i++) sum += serviceName.charCodeAt(i);
  return SERVICE_COLORS[sum % SERVICE_COLORS.length];
}

// Get initials from a user name or email
function getInitials(user) {
  if (!user) return "?";
  const name = user.name || user.email || "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Transform backend health record → UI service card shape
function transformHealthRecord(record, index) {
  const name =
    record.service
      ? record.service.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : `Service ${index + 1}`;
  const uptime = record.metrics?.uptime != null
    ? `${record.metrics.uptime.toFixed(1)}%`
    : "—";
  return {
    name,
    uptime,
    status: record.status || "unknown",
    Icon: resolveIcon(record.service || ""),
    color: resolveServiceColor(record.service || ""),
  };
}

// Transform backend incident → UI incident row shape
function transformIncident(incident, index) {
  const assignee = incident.assignedTo?.[0];
  return {
    id: incident._id ? `INC-${incident._id.slice(-4).toUpperCase()}` : `INC-${index}`,
    _id: incident._id,
    title: incident.title || "Untitled Incident",
    service: incident.service || "—",
    severity: incident.severity || "medium",
    status: incident.status || "open",
    assignee: assignee ? getInitials(assignee) : "—",
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  };
}

// Transform trends array → recharts format [{ date, opened, resolved }]
// Backend only returns count per day; map to "opened". resolved stays 0 unless available.
function transformTrends(rawTrends = []) {
  return rawTrends.map((item) => {
    const dateStr = item._id || "";
    const shortDate = dateStr.length >= 10 ? dateStr.slice(8, 10) : dateStr;
    return {
      date: shortDate || dateStr,
      opened: item.count || 0,
      resolved: item.resolved || 0,
    };
  });
}

export function useDashboardData() {
  const dispatch = useDispatch();
  const {
    stats,
    incidents: rawIncidents,
    healthData: rawHealth,
    trends: rawTrends,
    system,
    loadingStats,
    loadingIncidents,
    loadingHealth,
    loadingTrends,
    loadingSystem,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchIncidentTrends(7));
    dispatch(fetchIncidents({ limit: 10, status: "open" }));
    dispatch(fetchHealthData());
    dispatch(fetchSystemData());
  }, [dispatch]);

  // --- Derived / transformed data ---

  const statCards = [
    {
      label: "Total Incidents",
      val: String(stats?.incidents?.total ?? 0),
      trend: stats?.incidents?.total ? "↑ 12%" : "—",
      up: true,
      iconName: "Clock",
      color: "#818cf8",
    },
    {
      label: "Active Incidents",
      val: String(stats?.incidents?.open ?? 0),
      trend: stats?.incidents?.open === 0 ? "—" : "↓ 50%",
      up: false,
      iconName: "AlertTriangle",
      color: "#ef4444",
    },
    {
      label: "Resolved (7d)",
      val: String(stats?.incidents?.resolvedLast7Days ?? 0),
      trend: "↑ 32%",
      up: true,
      iconName: "CheckCircle",
      color: "#22c55e",
    },
    {
      label: "Critical Incidents",
      val: String(stats?.incidents?.critical ?? 0),
      trend: "—",
      up: null,
      iconName: "Zap",
      color: "#f97316",
    },
  ];

  const incidents = rawIncidents.map(transformIncident);
  const services = rawHealth.map(transformHealthRecord);
  const chartData = transformTrends(rawTrends);

  // Metrics from top responder or health aggregate
  const topResponders = stats?.topResponders ?? [];

  return {
    statCards,
    incidents,
    services,
    chartData,
    topResponders,
    system,
    errorsLast24h: stats?.errors?.last24h ?? 0,
    loadingStats,
    loadingIncidents,
    loadingHealth,
    loadingTrends,
    loadingSystem,
    isLoading: loadingStats || loadingIncidents || loadingHealth || loadingTrends || loadingSystem,
  };
}
