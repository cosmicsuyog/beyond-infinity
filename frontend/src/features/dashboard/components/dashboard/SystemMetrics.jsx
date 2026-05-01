import Sparkline from "../ui/Sparkline";

const SystemMetrics = ({ system, loading }) => {
  const metrics = [
    { 
      label: "CPU", 
      val: system?.metrics?.cpu ? `${system.metrics.cpu}%` : "—", 
      color: "#3b82f6", 
      sparkline: system?.metrics?.cpuHistory || [24, 20, 26, 14, 18, 10, 15, 8, 12, 6, 9] 
    },
    { 
      label: "Memory", 
      val: system?.metrics?.memory ? `${system.metrics.memory}%` : "—", 
      color: "#818cf8", 
      sparkline: system?.metrics?.memoryHistory || [20, 18, 22, 16, 20, 14, 18, 12, 16, 14, 11] 
    },
    { 
      label: "Disk", 
      val: system?.metrics?.disk ? `${system.metrics.disk}%` : "—", 
      color: "#22c55e", 
      sparkline: system?.metrics?.diskHistory || [22, 22, 20, 20, 18, 18, 16, 16, 15, 14, 14] 
    },
    { 
      label: "DB Resp", 
      val: system?.dbStatus?.latency ? `${system.dbStatus.latency}ms` : "—", 
      color: "#f59e0b", 
      sparkline: system?.dbStatus?.latencyHistory || [14, 18, 12, 20, 14, 22, 16, 24, 18, 26, 20] 
    },
  ];

  return (
    <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors sm:col-span-2 xl:col-span-1 xl:w-[290px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <span className="font-bebas text-[15px] tracking-[0.14em] text-white">SYSTEM METRICS</span>
      </div>
      <div className="font-barlow text-[8.5px] tracking-[0.12em] uppercase text-white/28 px-4 py-2">
        {loading ? "Fetching Signal…" : "Live Telemetry Active"}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2 px-3 pb-3">
        {metrics.map(m => (
          <div key={m.label} className="bg-white/[0.03] border border-white/[0.06] rounded-md p-2.5">
            <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/45 mb-1">{m.label}</div>
            <div className="font-bebas text-[24px] tracking-[0.08em] text-white leading-none mb-1.5">{m.val}</div>
            <Sparkline data={m.sparkline} color={m.color} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemMetrics;
