import { 
  Activity, X, LayoutDashboard, Clock, Server, Bell, AlignLeft, 
  BarChart2, Sparkles, Users, Key, Settings 
} from "lucide-react";
import { NAV_ITEMS } from '../../dashboard.constants';
import { useAuth } from '../../../auth/context/AuthContext';

const iconMap = {
  LayoutDashboard,
  Clock,
  Server,
  Bell,
  AlignLeft,
  BarChart2,
  Sparkles,
  Users,
  Key,
  Settings,
};

const IconComponent = ({ iconName }) => {
  const Icon = iconMap[iconName];
  if (!Icon) return null;
  return <Icon size={13} strokeWidth={1.6} />;
};

const Sidebar = ({ active, setActive, open, onClose }) => {
  const groups = ["MAIN","ANALYTICS","SYSTEM"];
  const { user } = useAuth();
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 sidebar-overlay lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <nav className={`
        fixed top-0 left-0 h-full z-50 flex flex-col
        w-[220px] bg-[#07080f] border-r border-white/[0.07]
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex lg:z-auto
      `}>
        <div className="dashboard-scanlines absolute inset-0 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col h-full">
          {/* Brand */}
          <div className="px-4 py-5 border-b border-white/[0.07]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/[0.08] border border-white/20 rounded-md flex items-center justify-center">
                  <Activity size={14} className="text-white" />
                </div>
                <span className="font-bebas text-[19px] tracking-[0.18em] text-white">OPSPULSE</span>
              </div>
              <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white/80 p-1">
                <X size={16} />
              </button>
            </div>
            <div className="font-barlow text-[9px] tracking-[0.22em] uppercase text-white/25 mt-1 pl-10">INCIDENT RESPONSE</div>
          </div>

          {/* Nav */}
          <div className="flex-1 overflow-y-auto px-2.5 py-2">
            {groups.map(g => (
              <div key={g}>
                <div className="font-barlow text-[8.5px] tracking-[0.28em] uppercase text-white/22 px-2 pt-3 pb-1.5 mt-1">{g}</div>
                {NAV_ITEMS.filter(n => n.group === g).map(n => (
                  <div
                    key={n.id}
                    onClick={() => { setActive(n.id); onClose(); }}
                    className={`
                      flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer mb-0.5
                      border-l-2 font-barlow text-[11px] tracking-[0.14em] uppercase
                      transition-all duration-200
                      ${active === n.id
                        ? "bg-white/[0.09] text-white border-l-white/40"
                        : "text-white/50 border-l-transparent hover:bg-white/[0.05] hover:text-white/85"
                      }
                    `}
                  >
                    <IconComponent iconName={n.Icon} />
                    {n.label}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Status + User */}
          <div>
            <div className="mx-3 mb-2.5 bg-white/[0.03] border border-white/[0.07] rounded-md p-2.5 flex items-center justify-between">
              <div>
                <div className="font-barlow text-[8.5px] tracking-[0.18em] uppercase text-white/25">System Status</div>
                <div className="font-barlow text-[10px] tracking-[0.12em] uppercase text-green-400 flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
                  All Operational
                </div>
              </div>
            </div>
            <div className="px-3.5 py-3 border-t border-white/[0.07] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/20 flex items-center justify-center text-[11px] font-semibold text-white relative flex-shrink-0">
                {user ? (user.name || user.email).substring(0, 2).toUpperCase() : "AR"}
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-green-400 border-[1.5px] border-[#07080f]" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-barlow text-[11px] tracking-[0.1em] uppercase text-white truncate">
                  {user ? user.name || user.email : "Aarav Singh"}
                </div>
                <div className="font-barlow text-[9px] tracking-[0.16em] uppercase text-white/25 truncate">
                  {user?.role || "Admin"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
