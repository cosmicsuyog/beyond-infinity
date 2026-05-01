import { useState } from "react";
import { 
  Bell, Filter, RefreshCw, AlertTriangle, 
  Terminal, ShieldAlert, Zap, Search
} from "lucide-react";
import PageHeader from "../ui/PageHeader";
import GhostBtn from "../ui/GhostBtn";
import Badge from "../ui/Badge";
import CustomSelect from "../ui/CustomSelect";
import { useAlerts } from "./useAlerts";

const Skeleton = ({ w = "w-24", h = "h-3" }) => (
  <div className={`${w} ${h} rounded bg-white/[0.06] animate-pulse`} />
);

const AlertItem = ({ alert }) => {
  const [expanded, setExpanded] = useState(false);
  const timestamp = new Date(alert.timestamp || alert.createdAt).toLocaleString();
  const statusCode = alert.statusCode || "---";
  
  // Logic to determine color based on status code
  const isCritical = statusCode >= 500;
  const statusColor = isCritical ? "#ef4444" : "#f59e0b";

  return (
    <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] transition-all rounded-lg overflow-hidden mb-3 group">
      <div 
        className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
            <ShieldAlert size={14} style={{ color: statusColor }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-barlow text-[10px] tracking-[0.2em] text-white/30 uppercase">{alert.service}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span className="font-mono text-[10px] text-white/40">{timestamp}</span>
            </div>
            <h4 className="font-barlow text-[13px] tracking-[0.05em] text-white group-hover:text-white transition-colors uppercase truncate">
              {alert.error}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="font-barlow text-[8px] tracking-[0.2em] uppercase text-white/25">Status</div>
            <div className="font-bebas text-[14px] text-white/80">{statusCode}</div>
          </div>
          <Badge type={isCritical ? "critical" : "high"}>
            {isCritical ? "CRITICAL" : "WARNING"}
          </Badge>
          <div className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
            <Zap size={10} className="text-white/20" />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/[0.05] bg-black/20">
          <div className="space-y-4">
            {alert.stackTrace && (
              <div>
                <div className="flex items-center gap-2 font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/25 mb-2">
                  <Terminal size={10} /> Stack Trace
                </div>
                <pre className="font-mono text-[10px] text-white/50 bg-black/40 p-3 rounded border border-white/[0.03] overflow-x-auto whitespace-pre-wrap max-h-[200px] custom-scrollbar">
                  {alert.stackTrace}
                </pre>
              </div>
            )}
            
            {alert.metadata && Object.keys(alert.metadata).length > 0 && (
              <div>
                <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/25 mb-2">Contextual Metadata</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(alert.metadata).map(([key, val]) => (
                    <div key={key} className="bg-white/[0.02] border border-white/[0.05] p-2 rounded">
                      <div className="font-barlow text-[8px] tracking-[0.1em] text-white/20 uppercase mb-0.5">{key}</div>
                      <div className="font-mono text-[10px] text-white/60 truncate">{String(val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <GhostBtn>ACKNOWLEDGE</GhostBtn>
              <GhostBtn>CREATE INCIDENT</GhostBtn>
              <GhostBtn>IGNORE</GhostBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertsView = () => {
  const { alerts, loading, error, filters, updateFilters, refresh } = useAlerts();
  const [search, setSearch] = useState("");

  const filteredAlerts = alerts.filter(a => 
    a.service.toLowerCase().includes(search.toLowerCase()) || 
    a.error.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="SYSTEM ALERTS" subtitle="Real-time intake of system errors and anomalous patterns">
        <GhostBtn onClick={refresh}>
          <RefreshCw size={10} className={`inline mr-1.5 align-middle ${loading ? "animate-spin" : ""}`} />
          REFRESH
        </GhostBtn>
      </PageHeader>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 font-barlow text-[11px] tracking-[0.08em] px-4 py-3 rounded-lg uppercase flex items-center gap-2">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="fade-up fade-up-1 bg-[#0b0d18] border border-white/[0.07] rounded-lg p-3 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input 
            type="text"
            placeholder="SEARCH ERRORS OR SERVICES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-white font-barlow text-[10px] tracking-[0.15em] uppercase focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-white/25 shrink-0">
            <Filter size={12} />
            <span className="font-barlow text-[9px] tracking-[0.2em] uppercase">Filter</span>
          </div>
          <CustomSelect 
            value={filters.processed}
            onChange={(e) => updateFilters({ processed: e.target.value })}
            placeholder="All Alerts"
            options={[
              { value: "false", label: "Unprocessed" },
              { value: "true", label: "Processed" }
            ]}
            className="flex-1 lg:min-w-[140px]"
          />
        </div>
      </div>

      {/* List */}
      <div className="fade-up fade-up-2">
        {loading ? (
          [0,1,2,3,4].map(i => (
            <div key={i} className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-5 mb-3 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06]" />
                  <div className="space-y-2">
                    <div className="h-2 w-32 bg-white/[0.06] rounded" />
                    <div className="h-4 w-64 bg-white/[0.04] rounded" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-white/[0.06] rounded" />
              </div>
            </div>
          ))
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-20 bg-[#0b0d18] border border-white/[0.07] border-dashed rounded-lg">
            <Bell size={30} className="mx-auto text-white/10 mb-4" />
            <div className="font-barlow text-[11px] tracking-[0.2em] uppercase text-white/30">
              No alerts found matching current criteria
            </div>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertItem key={alert._id} alert={alert} />
          ))
        )}
      </div>
    </>
  );
};

export default AlertsView;
