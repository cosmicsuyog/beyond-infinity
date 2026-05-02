import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../dashboard.slice";
import PageHeader from "../ui/PageHeader";
import Badge from "../ui/Badge";
import CustomTooltip from "../ui/CustomTooltip";

const Skeleton = ({ w = "w-24", h = "h-3" }) => (
  <div className={`${w} ${h} rounded bg-white/[0.06] animate-pulse`} />
);

const AnalyticsView = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState("7d");
  const [chartType, setChartType] = useState("line");

  const { loadingStats } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Generate analytics data - memoized to avoid re-computing on every render
  const analyticsData = useMemo(
    () => [
      {
        period: "Mon",
        errors: Math.floor(Math.random() * 50),
        resolved: Math.floor(Math.random() * 40),
        avgResponse: 125 + Math.floor(Math.random() * 50),
      },
      {
        period: "Tue",
        errors: Math.floor(Math.random() * 55),
        resolved: Math.floor(Math.random() * 45),
        avgResponse: 115 + Math.floor(Math.random() * 50),
      },
      {
        period: "Wed",
        errors: Math.floor(Math.random() * 48),
        resolved: Math.floor(Math.random() * 42),
        avgResponse: 120 + Math.floor(Math.random() * 50),
      },
      {
        period: "Thu",
        errors: Math.floor(Math.random() * 60),
        resolved: Math.floor(Math.random() * 48),
        avgResponse: 130 + Math.floor(Math.random() * 50),
      },
      {
        period: "Fri",
        errors: Math.floor(Math.random() * 52),
        resolved: Math.floor(Math.random() * 44),
        avgResponse: 118 + Math.floor(Math.random() * 50),
      },
      {
        period: "Sat",
        errors: Math.floor(Math.random() * 40),
        resolved: Math.floor(Math.random() * 35),
        avgResponse: 110 + Math.floor(Math.random() * 50),
      },
      {
        period: "Sun",
        errors: Math.floor(Math.random() * 38),
        resolved: Math.floor(Math.random() * 33),
        avgResponse: 105 + Math.floor(Math.random() * 50),
      },
    ],
    []
  );

  // Endpoint breakdown
  const endpointData = [
    { endpoint: "/api/incidents", calls: 4250, errors: 12, avgTime: 145 },
    { endpoint: "/api/health", calls: 8900, errors: 5, avgTime: 78 },
    { endpoint: "/api/errors", calls: 3200, errors: 8, avgTime: 203 },
    { endpoint: "/api/dashboard/stats", calls: 5600, errors: 3, avgTime: 89 },
    { endpoint: "/api/timeline", calls: 2100, errors: 2, avgTime: 156 },
  ];

  // Error breakdown by type
  const errorTypeData = [
    { type: "Database", count: 24, percentage: 35, color: "#ef4444" },
    { type: "Timeout", count: 16, percentage: 23, color: "#f59e0b" },
    { type: "Auth", count: 12, percentage: 17, color: "#3b82f6" },
    { type: "Validation", count: 10, percentage: 15, color: "#818cf8" },
    { type: "Other", count: 7, percentage: 10, color: "#64748b" },
  ];

  const totalRequests = endpointData.reduce((sum, ep) => sum + ep.calls, 0);
  const totalErrors = endpointData.reduce((sum, ep) => sum + ep.errors, 0);
  const avgResponseTime = Math.round(
    endpointData.reduce((sum, ep) => sum + ep.avgTime, 0) / endpointData.length
  );
  const successRate = (
    ((totalRequests - totalErrors) / totalRequests) *
    100
  ).toFixed(2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="ANALYTICS"
        subtitle="Performance metrics and error tracking across all services"
      >
        <div className="flex gap-2">
          {["24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`font-barlow text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                timeRange === range
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-white/[0.03] border-white/10 text-white/45 hover:text-white/70"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* ── STATS OVERVIEW ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Requests",
            value: totalRequests.toLocaleString(),
            trend: "+12%",
            icon: TrendingUp,
            color: "#3b82f6",
          },
          {
            label: "Error Rate",
            value: `${((totalErrors / totalRequests) * 100).toFixed(2)}%`,
            trend: "-2.3%",
            icon: TrendingDown,
            color: "#22c55e",
          },
          {
            label: "Avg Response",
            value: `${avgResponseTime}ms`,
            trend: "-15ms",
            icon: TrendingDown,
            color: "#818cf8",
          },
          {
            label: "Success Rate",
            value: `${successRate}%`,
            trend: "+0.8%",
            icon: TrendingUp,
            color: "#22c55e",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-4 relative overflow-hidden transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${stat.color}22` }}
            >
              <stat.icon
                size={14}
                strokeWidth={1.6}
                style={{ color: stat.color }}
              />
            </div>
            <div className="font-bebas text-[36px] sm:text-[42px] leading-none tracking-[0.06em] text-white mb-1">
              {stat.value}
            </div>
            <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/45 mb-2 leading-tight">
              {stat.label}
            </div>
            <div
              className="font-barlow text-[10px] tracking-[0.1em]"
              style={{
                color: stat.trend.includes("-") ? "#22c55e" : "#ef4444",
              }}
            >
              {stat.trend}
              <span className="text-white/25 ml-1.5 text-[9px]">
                vs last wk
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Request Trends */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">
              REQUEST TRENDS
            </span>
            <div className="flex gap-1">
              {["line", "bar"].map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`font-barlow text-[8px] tracking-[0.14em] uppercase px-2 py-1 rounded text-white/45 text-[7px] ${
                    chartType === type ? "text-white" : ""
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 px-4 py-2.5 text-[9px]">
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-0.5 rounded-full inline-block"
                style={{ background: "#ef4444" }}
              />
              <span className="font-barlow tracking-[0.12em] uppercase text-white/45">
                Errors
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-0.5 rounded-full inline-block"
                style={{ background: "#22c55e" }}
              />
              <span className="font-barlow tracking-[0.12em] uppercase text-white/45">
                Resolved
              </span>
            </div>
          </div>
          <div style={{ height: 240, width: "100%" }} className="px-3 pb-3">
            {loadingStats ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton w="w-40" h="h-32" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                {chartType === "line" ? (
                  <LineChart
                    data={analyticsData}
                    margin={{ top: 5, right: 10, left: -30, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="rgba(240,240,250,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 8, fill: "rgba(240,240,250,0.3)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 8, fill: "rgba(240,240,250,0.3)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 8 }} />
                    <Line
                      type="monotone"
                      dataKey="errors"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      name="Errors"
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                      name="Resolved"
                    />
                  </LineChart>
                ) : (
                  <BarChart
                    data={analyticsData}
                    margin={{ top: 5, right: 10, left: -30, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="rgba(240,240,250,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 8, fill: "rgba(240,240,250,0.3)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 8, fill: "rgba(240,240,250,0.3)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 8 }} />
                    <Bar dataKey="errors" fill="#ef4444" name="Errors" />
                    <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Response Time Distribution */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">
              RESPONSE TIMES
            </span>
          </div>
          <div style={{ height: 240, width: "100%" }} className="px-3 pb-3">
            {loadingStats ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton w="w-40" h="h-32" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={analyticsData}
                  margin={{ top: 5, right: 10, left: -30, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(240,240,250,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 8, fill: "rgba(240,240,250,0.3)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 8, fill: "rgba(240,240,250,0.3)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="avgResponse"
                    stroke="#818cf8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Avg Response (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ── ENDPOINT BREAKDOWN ──────────────────────────────── */}
      <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
        <div className="px-4 py-3 border-b border-white/[0.07]">
          <span className="font-bebas text-[15px] tracking-[0.14em] text-white">
            USAGE BY ENDPOINT
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  "Endpoint",
                  "Calls",
                  "Errors",
                  "Error Rate",
                  "Avg Response",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/30 px-4 py-2.5 text-left border-b border-white/[0.07] bg-white/[0.02] font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {endpointData.map((endpoint, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white/[0.025] transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[10px] text-white/78">
                    {endpoint.endpoint}
                  </td>
                  <td className="px-4 py-3 font-barlow text-[11px] tracking-[0.08em] text-white/78">
                    {endpoint.calls.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-barlow text-[11px] tracking-[0.08em] text-white/78">
                    {endpoint.errors}
                  </td>
                  <td className="px-4 py-3">
                    <Badge type={endpoint.errors > 10 ? "high" : "low"}>
                      {((endpoint.errors / endpoint.calls) * 100).toFixed(2)}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-barlow text-[11px] tracking-[0.08em] text-white/78">
                    {endpoint.avgTime}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ERROR TYPE BREAKDOWN ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Error Types */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">
              ERROR BREAKDOWN
            </span>
          </div>
          <div className="p-4 space-y-3">
            {errorTypeData.map((type) => (
              <div key={type.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-barlow text-[11px] tracking-[0.08em] text-white/78">
                    {type.type}
                  </span>
                  <span className="font-barlow text-[10px] tracking-[0.1em] text-white/45">
                    {type.count} ({type.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/[0.05] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${type.percentage}%`,
                      background: type.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Snapshot */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">
              HEALTH SNAPSHOT
            </span>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-barlow text-[11px] tracking-[0.08em] text-white/78">
                  System Uptime
                </span>
                <span className="font-barlow text-[11px] tracking-[0.1em] text-green-400">
                  99.9%
                </span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-2">
                <div className="w-[99.9%] bg-green-500/60 rounded-full h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-barlow text-[11px] tracking-[0.08em] text-white/78">
                  API Availability
                </span>
                <span className="font-barlow text-[11px] tracking-[0.1em] text-blue-400">
                  99.7%
                </span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-2">
                <div className="w-[99.7%] bg-blue-500/60 rounded-full h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-barlow text-[11px] tracking-[0.08em] text-white/78">
                  Database Health
                </span>
                <span className="font-barlow text-[11px] tracking-[0.1em] text-yellow-400">
                  98.2%
                </span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-2">
                <div className="w-[98.2%] bg-yellow-500/60 rounded-full h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
