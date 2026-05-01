import { Monitor, Database, Shield, CreditCard } from "lucide-react";
import Badge from "../ui/Badge";

const iconMap = { Monitor, Database, Shield, CreditCard };

const IconComponent = ({ iconName }) => {
  const Icon = iconMap[iconName] || Monitor;
  return <Icon size={12} strokeWidth={1.6} />;
};

const Skeleton = ({ w = "w-24", h = "h-3" }) => (
  <div className={`${w} ${h} rounded bg-white/[0.06] animate-pulse`} />
);

const SystemHealth = ({ services, loading }) => {
  return (
    <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <span className="font-bebas text-[15px] tracking-[0.14em] text-white">SYSTEM HEALTH</span>
        <span className="font-barlow text-[9.5px] tracking-[0.14em] uppercase text-white/45 cursor-pointer hover:text-white/70 transition">View all →</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1">
        {loading
          ? [0, 1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-white/[0.05] animate-pulse flex-shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton w="w-20" h="h-2.5" />
                    <Skeleton w="w-12" h="h-2" />
                  </div>
                </div>
                <Skeleton w="w-10" h="h-4" />
              </div>
            ))
          : services.map(svc => (
              <div key={svc.name} className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${svc.color}18` }}>
                    <IconComponent iconName={svc.Icon} />
                  </div>
                  <div>
                    <div className="font-barlow text-[10.5px] tracking-[0.1em] uppercase text-white mb-0.5">{svc.name}</div>
                    <div className="font-barlow text-[9px] tracking-[0.1em] text-white/45">{svc.uptime} uptime</div>
                  </div>
                </div>
                <Badge type={svc.status}>{svc.status.toUpperCase()}</Badge>
              </div>
            ))}
      </div>
    </div>
  );
};

export default SystemHealth;
