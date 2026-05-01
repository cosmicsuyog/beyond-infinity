import { useState } from "react";
import { Plus, Filter, RefreshCw, AlertTriangle } from "lucide-react";
import PageHeader from "../ui/PageHeader";
import GhostBtn from "../ui/GhostBtn";
import Badge from "../ui/Badge";
import { useIncidents } from "./useIncidents";
import CreateIncidentModal from "./CreateIncidentModal";
import CustomSelect from "../ui/CustomSelect";

// Avatar color palette for assignees (cycles by index)
const AVATAR_COLORS = [
  "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#818cf8",
  "#ec4899", "#14b8a6", "#f97316",
];

// Get initials from a user name or email
function getInitials(user) {
  if (!user) return "—";
  if (typeof user === 'string') return user.substring(0, 2).toUpperCase();
  const name = user.name || user.email || "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const Skeleton = ({ w = "w-24", h = "h-3" }) => (
  <div className={`${w} ${h} rounded bg-white/[0.06] animate-pulse`} />
);

const IncidentsView = () => {
  const { incidents, loading, error, filters, updateFilters, refresh, createIncident, updateStatus } = useIncidents();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleStatusChange = async (id, currentStatus) => {
    // Simple toggle between status states for demo purposes
    const nextStatus = currentStatus === "open" ? "investigating" 
                     : currentStatus === "investigating" ? "identified" 
                     : currentStatus === "identified" ? "monitoring"
                     : currentStatus === "monitoring" ? "resolved"
                     : "open";
    
    await updateStatus(id, nextStatus);
  };

  return (
    <>
      <PageHeader title="INCIDENTS" subtitle="Manage and track active system anomalies">
        <GhostBtn onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={10} className="inline mr-1.5 align-middle" />
          NEW INCIDENT
        </GhostBtn>
        <GhostBtn onClick={refresh}>
          <RefreshCw size={10} className={`inline mr-1.5 align-middle ${loading ? "animate-spin" : ""}`} />
          REFRESH
        </GhostBtn>
      </PageHeader>

      {/* Error state */}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 font-barlow text-[11px] tracking-[0.08em] px-4 py-3 rounded-lg uppercase flex items-center gap-2">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {/* Filters Bar */}
      <div className="fade-up fade-up-1 bg-[#0b0d18] border border-white/[0.07] rounded-lg p-3 mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-white/50">
          <Filter size={13} />
          <span className="font-barlow text-[10px] tracking-[0.14em] uppercase">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <CustomSelect 
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            placeholder="All Statuses"
            options={[
              { value: "open", label: "Open" },
              { value: "investigating", label: "Investigating" },
              { value: "identified", label: "Identified" },
              { value: "monitoring", label: "Monitoring" },
              { value: "resolved", label: "Resolved" },
            ]}
            className="min-w-[130px]"
          />
          <CustomSelect 
            value={filters.severity}
            onChange={(e) => updateFilters({ severity: e.target.value })}
            placeholder="All Severities"
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
            className="min-w-[130px]"
          />
        </div>
      </div>

      {/* Incident List */}
      <div className="fade-up fade-up-2 bg-[#0b0d18] border border-white/[0.07] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                {["ID", "TITLE", "SERVICE", "SEVERITY", "STATUS", "ASSIGNED", "CREATED"].map(h => (
                  <th key={h} className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/30 px-5 py-3.5 text-left border-b border-white/[0.07] bg-white/[0.02] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                [0,1,2,3,4].map(i => (
                  <tr key={i}>
                    {[0,1,2,3,4,5,6].map(j => (
                      <td key={j} className="px-5 py-4"><Skeleton w={j === 1 ? "w-48" : "w-16"} /></td>
                    ))}
                  </tr>
                ))
              ) : incidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center font-barlow text-[11px] tracking-[0.18em] uppercase text-white/25">
                    No incidents found matching current filters
                  </td>
                </tr>
              ) : (
                incidents.map((inc, i) => {
                  const displayId = inc._id ? `INC-${inc._id.slice(-4).toUpperCase()}` : `INC-${i}`;
                  const assignee = inc.assignedTo?.[0] || inc.assignee;
                  const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const dateObj = new Date(inc.createdAt || Date.now());
                  const formattedDate = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

                  return (
                    <tr key={inc._id || i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4 font-mono text-[10px] text-white/45">{displayId}</td>
                      <td className="px-5 py-4 font-barlow text-[12px] tracking-[0.08em] text-white/85">{inc.title}</td>
                      <td className="px-5 py-4 font-barlow text-[11px] tracking-[0.08em] text-white/50">{inc.service}</td>
                      <td className="px-5 py-4"><Badge type={inc.severity || "low"}>{inc.severity || "low"}</Badge></td>
                      <td className="px-5 py-4">
                        <div 
                          className="cursor-pointer hover:opacity-80 transition-opacity" 
                          onClick={() => handleStatusChange(inc._id, inc.status || "open")}
                          title="Click to advance status"
                        >
                          <Badge type={inc.status || "open"}>{inc.status || "open"}</Badge>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[9px] font-semibold flex-shrink-0"
                              style={{ background:`${avatarColor}22`, color:avatarColor, border:`1px solid ${avatarColor}44` }}
                            >
                              {getInitials(assignee)}
                            </span>
                            <span className="font-barlow text-[10px] tracking-[0.08em] text-white/40 hidden md:block">
                              {typeof assignee === 'string' ? assignee : assignee.name || assignee.email}
                            </span>
                          </div>
                        ) : (
                          <span className="font-barlow text-[10px] tracking-[0.1em] text-white/20 uppercase">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-barlow text-[10px] tracking-[0.08em] text-white/30">{formattedDate}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateIncidentModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createIncident}
      />
    </>
  );
};

export default IncidentsView;
