import { Clock, AlertTriangle, CheckCircle, Zap } from "lucide-react";

const statIconMap = { Clock, AlertTriangle, CheckCircle, Zap };

const StatCardSkeleton = () => (
  <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 relative overflow-hidden">
    <div className="w-8 h-8 rounded-lg bg-white/[0.06] animate-pulse mb-3" />
    <div className="h-9 w-16 rounded bg-white/[0.06] animate-pulse mb-2" />
    <div className="h-2 w-20 rounded bg-white/[0.04] animate-pulse mb-2" />
    <div className="h-2 w-12 rounded bg-white/[0.04] animate-pulse" />
  </div>
);

const StatCards = ({ cards, loading }) => {
  if (loading) {
    return (
      <div className="fade-up fade-up-1 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
        {[0, 1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="fade-up fade-up-1 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
      {cards.map(({ label, val, trend, up, iconName, color }) => {
        const Icon = statIconMap[iconName] || Clock;
        return (
          <div
            key={label}
            className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-4 relative overflow-hidden transition-colors cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}22` }}>
              <Icon size={14} strokeWidth={1.6} style={{ color }} />
            </div>
            <div className="font-bebas text-[36px] sm:text-[42px] leading-none tracking-[0.06em] text-white mb-1">{val}</div>
            <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/45 mb-2 leading-tight">{label}</div>
            <div
              className="font-barlow text-[10px] tracking-[0.1em]"
              style={{ color: up === true ? "#22c55e" : up === false ? "#ef4444" : "rgba(240,240,250,0.25)" }}
            >
              {trend}
              {up !== null && <span className="text-white/25 ml-1.5 text-[9px]">vs last wk</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
