import { useState } from "react";
import { Plus, Filter, RefreshCw, AlertTriangle, Clock } from "lucide-react";
import PageHeader from "../ui/PageHeader";
import GhostBtn from "../ui/GhostBtn";
import Badge from "../ui/Badge";
import { useTimeline } from "./useTimeline";
import CreateEventModal from "./CreateEventModal";
import CustomSelect from "../ui/CustomSelect";

const TimelineView = () => {
  const { events, loading, error, filters, updateFilters, refresh, createEvent } = useTimeline();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getEventBadgeType = (type) => {
    switch(type) {
      case 'alert': return 'high';
      case 'status_change': return 'medium';
      case 'resolution': return 'up';
      case 'note':
      default: return 'low';
    }
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'alert': return '#ef4444'; // Red
      case 'status_change': return '#f59e0b'; // Amber
      case 'resolution': return '#22c55e'; // Green
      case 'note':
      default: return '#818cf8'; // Indigo
    }
  };

  return (
    <>
      <PageHeader title="SYSTEM TIMELINE" subtitle="Chronological log of events and alerts">
        <GhostBtn onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={10} className="inline mr-1.5 align-middle" />
          ADD EVENT
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
      <div className="fade-up fade-up-1 bg-[#0b0d18] border border-white/[0.07] rounded-lg p-3 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-white/50">
          <Filter size={13} />
          <span className="font-barlow text-[10px] tracking-[0.14em] uppercase">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <CustomSelect 
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value })}
            placeholder="All Types"
            options={[
              { value: "note", label: "Notes" },
              { value: "status_change", label: "Status Changes" },
              { value: "alert", label: "Alerts" },
              { value: "resolution", label: "Resolutions" },
            ]}
            className="min-w-[150px]"
          />
        </div>
      </div>

      {/* Timeline List */}
      <div className="fade-up fade-up-2 pl-4 md:pl-8 max-w-4xl pb-10">
        {loading ? (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/[0.07] before:to-transparent">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white/20 bg-white/[0.06] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow animate-pulse"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white/[0.02] border border-white/[0.04] p-4 rounded-lg animate-pulse">
                  <div className="h-3 w-1/3 bg-white/[0.06] rounded mb-2"></div>
                  <div className="h-2 w-1/4 bg-white/[0.06] rounded mb-4"></div>
                  <div className="h-10 w-full bg-white/[0.04] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 border border-white/[0.07] border-dashed rounded-lg bg-white/[0.01]">
            <Clock size={24} className="mx-auto text-white/20 mb-3" />
            <div className="font-barlow text-[11px] tracking-[0.18em] uppercase text-white/40">
              No timeline events found
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-[11px] before:h-full before:w-[1px] before:bg-white/[0.1]">
            {events.map((event, i) => {
              const color = getEventColor(event.type);
              const dateObj = new Date(event.timestamp || event.createdAt || Date.now());
              const dateStr = dateObj.toLocaleDateString();
              const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});

              return (
                <div key={event._id || i} className="relative pl-10 group">
                  {/* Timeline Dot */}
                  <div 
                    className="absolute left-0 top-1.5 flex items-center justify-center w-[23px] h-[23px] rounded-full shrink-0 z-10"
                    style={{ background: `${color}15`, border: `1px solid ${color}40` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></div>
                  </div>

                  {/* Event Content */}
                  <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.15] transition-colors rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge type={getEventBadgeType(event.type)}>{(event.type || "note").replace("_", " ")}</Badge>
                          <span className="font-mono text-[9px] text-white/30">
                            {event._id ? `EVT-${event._id.slice(-4).toUpperCase()}` : `EVT-${i}`}
                          </span>
                        </div>
                        <h3 className="font-barlow text-[14px] tracking-[0.08em] text-white/90 uppercase">
                          {event.title}
                        </h3>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="font-barlow text-[10px] tracking-[0.12em] text-white/50">{dateStr}</div>
                        <div className="font-mono text-[10px] text-white/30 mt-0.5">{timeStr}</div>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="font-barlow text-[11px] tracking-[0.05em] text-white/60 uppercase leading-relaxed mt-1">
                        {event.description}
                      </p>
                    )}

                    {event.incidentId && (
                      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-2">
                        <span className="font-barlow text-[9px] tracking-[0.1em] uppercase text-white/40">Linked Incident:</span>
                        <span className="font-mono text-[9px] text-white/70 bg-white/[0.05] px-2 py-0.5 rounded">
                          INC-{event.incidentId.slice(-4).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateEventModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createEvent}
      />
    </>
  );
};

export default TimelineView;
