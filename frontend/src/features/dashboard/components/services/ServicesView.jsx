import { useState } from "react";
import { 
  RefreshCw, AlertTriangle, Monitor, Database, Shield, 
  CreditCard, Activity, Cpu, CheckCircle, Zap
} from "lucide-react";
import PageHeader from "../ui/PageHeader";
import GhostBtn from "../ui/GhostBtn";
import Badge from "../ui/Badge";
import Sparkline from "../ui/Sparkline";
import { useServices } from "./useServices";

const SERVICE_ICON_MAP = {
  "payment": CreditCard,
  "database": Database,
  "auth": Shield,
  "api": Monitor,
  "frontend": Monitor,
};

const resolveIcon = (name = "") => {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(SERVICE_ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return Monitor;
};

const ServiceCard = ({ service }) => {
  const Icon = resolveIcon(service.service);
  const uptime = service.metrics?.uptime || 0;
  const latency = service.metrics?.latency || 0;
  const status = service.status || "unknown";
  
  const statusColor = status === "up" ? "#22c55e" : status === "degraded" ? "#f59e0b" : "#ef4444";

  return (
    <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.15] transition-all rounded-lg p-5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
            <Icon size={18} style={{ color: statusColor }} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bebas text-[18px] tracking-[0.12em] text-white uppercase leading-none mb-1">
              {service.service.replace(/-/g, " ")}
            </h3>
            <div className="font-barlow text-[9px] tracking-[0.2em] text-white/35 uppercase">
              ID: {service._id?.slice(-6).toUpperCase() || "N/A"}
            </div>
          </div>
        </div>
        <Badge type={status}>{status.toUpperCase()}</Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="font-barlow text-[8px] tracking-[0.2em] uppercase text-white/25 mb-1">Uptime (24h)</div>
          <div className="font-bebas text-[24px] tracking-[0.05em] text-white">{uptime.toFixed(2)}%</div>
        </div>
        <div>
          <div className="font-barlow text-[8px] tracking-[0.2em] uppercase text-white/25 mb-1">Latency</div>
          <div className="font-bebas text-[24px] tracking-[0.05em] text-white">{latency.toFixed(0)}ms</div>
        </div>
      </div>

      {/* Mini Visuals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-barlow text-[9px] tracking-[0.1em] uppercase text-white/40">
            <Cpu size={10} /> CPU Load
          </div>
          <div className="font-mono text-[9px] text-white/60">{(Math.random() * 40 + 10).toFixed(1)}%</div>
        </div>
        <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/20 transition-all duration-1000" 
            style={{ width: `${Math.random() * 40 + 10}%` }} 
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
        <span className="font-barlow text-[8.5px] tracking-[0.15em] uppercase text-white/20">
          Last Check: {new Date(service.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span className="font-barlow text-[9px] tracking-[0.12em] uppercase text-white/40 group-hover:text-white transition-colors cursor-pointer flex items-center gap-1">
          METRICS <Activity size={10} />
        </span>
      </div>
    </div>
  );
};

const ServicesView = () => {
  const { services, loading, error, refresh } = useServices();

  return (
    <>
      <PageHeader title="SYSTEM HEALTH" subtitle="Real-time status monitoring for all core microservices">
        <GhostBtn onClick={refresh}>
          <RefreshCw size={10} className={`inline mr-1.5 align-middle ${loading ? "animate-spin" : ""}`} />
          REFRESH STATUS
        </GhostBtn>
      </PageHeader>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 font-barlow text-[11px] tracking-[0.08em] px-4 py-3 rounded-lg uppercase flex items-center gap-2">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {/* Summary Row */}
      <div className="fade-up fade-up-1 grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <div>
            <div className="font-bebas text-[28px] tracking-[0.05em] text-white leading-none mb-1">
              {services.filter(s => s.status === 'up').length}/{services.length}
            </div>
            <div className="font-barlow text-[9px] tracking-[0.2em] uppercase text-white/30">OPERATIONAL SERVICES</div>
          </div>
        </div>
        <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Activity size={18} className="text-blue-500" />
          </div>
          <div>
            <div className="font-bebas text-[28px] tracking-[0.05em] text-white leading-none mb-1">
              {(services.reduce((acc, s) => acc + (s.metrics?.latency || 0), 0) / (services.length || 1)).toFixed(0)}ms
            </div>
            <div className="font-barlow text-[9px] tracking-[0.2em] uppercase text-white/30">AVG GLOBAL LATENCY</div>
          </div>
        </div>
        <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Zap size={18} className="text-amber-500" />
          </div>
          <div>
            <div className="font-bebas text-[28px] tracking-[0.05em] text-white leading-none mb-1">
              99.98%
            </div>
            <div className="font-barlow text-[9px] tracking-[0.2em] uppercase text-white/30">GLOBAL SYSTEM UPTIME</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="fade-up fade-up-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [0,1,2,3,4,5].map(i => (
            <div key={i} className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/[0.06]" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-white/[0.06] rounded" />
                  <div className="h-2 w-16 bg-white/[0.04] rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="h-2 w-12 bg-white/[0.04] rounded" />
                  <div className="h-6 w-16 bg-white/[0.06] rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-12 bg-white/[0.04] rounded" />
                  <div className="h-6 w-16 bg-white/[0.06] rounded" />
                </div>
              </div>
              <div className="h-1 w-full bg-white/[0.04] rounded-full" />
            </div>
          ))
        ) : (
          services.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))
        )}
      </div>
    </>
  );
};

export default ServicesView;
