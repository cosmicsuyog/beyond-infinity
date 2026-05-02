import { useState, useEffect, useRef } from "react";
import { Search, X, Command, AlertTriangle, Monitor, User, Shield } from "lucide-react";
import { useSelector } from "react-redux";

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  
  // Get data from Redux for search
  const { incidents, healthData } = useSelector((state) => state.dashboard);
  
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Search logic (Frontend only)
  const results = {
    incidents: incidents.filter(inc => 
      inc.title?.toLowerCase().includes(query.toLowerCase()) ||
      inc._id?.toLowerCase().includes(query.toLowerCase()) ||
      inc.service?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4),
    services: healthData.filter(svc => 
      svc.service?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3),
    actions: [
      { name: "Create New Incident", icon: AlertTriangle, color: "#ef4444" },
      { name: "User Management", icon: User, color: "#3b82f6" },
      { name: "Security Audit", icon: Shield, color: "#22c55e" },
    ].filter(a => a.name.toLowerCase().includes(query.toLowerCase())),
  };

  const hasResults = query.length > 0 && (results.incidents.length > 0 || results.services.length > 0 || results.actions.length > 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Search Container */}
      <div className="relative w-full max-w-xl bg-[#0b0d18] border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center px-4 h-14 border-b border-white/[0.08]">
          <Search size={18} className="text-white/35 mr-3" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type command or search signal..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] font-barlow tracking-wide text-white placeholder:text-white/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded px-1.5 py-0.5 ml-2">
            <span className="text-[9px] font-barlow text-white/40 tracking-widest">ESC</span>
          </div>
          <button 
            onClick={onClose}
            className="ml-4 p-1 hover:bg-white/5 rounded-full transition text-white/30 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {!query && (
            <div className="p-6 text-center">
              <Command size={32} className="mx-auto text-white/10 mb-3" />
              <p className="font-barlow text-[13px] text-white/30 tracking-[0.05em]">
                Enter a search term to find incidents, services, or actions
              </p>
            </div>
          )}

          {query && !hasResults && (
            <div className="p-12 text-center">
              <p className="font-barlow text-[13px] text-white/40 tracking-[0.05em]">
                No signals found matching <span className="text-white/80">"{query}"</span>
              </p>
            </div>
          )}

          {query && hasResults && (
            <div className="p-2 space-y-4 pb-4">
              {/* Actions Section */}
              {results.actions.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 font-bebas text-[11px] tracking-[0.2em] text-white/25 uppercase">Commands</div>
                  {results.actions.map(action => (
                    <div key={action.name} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center bg-white/[0.03] group-hover:bg-white/[0.08]" style={{ color: action.color }}>
                        <action.icon size={14} />
                      </div>
                      <span className="font-barlow text-[13px] text-white/70 group-hover:text-white">{action.name}</span>
                      <span className="ml-auto font-mono text-[9px] text-white/15 opacity-0 group-hover:opacity-100">ENTER</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Incidents Section */}
              {results.incidents.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 font-bebas text-[11px] tracking-[0.2em] text-white/25 uppercase">Active Incidents</div>
                  {results.incidents.map(inc => (
                    <div key={inc._id} className="flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer group">
                      <div className="flex flex-col">
                        <span className="font-barlow text-[13px] text-white/75 group-hover:text-white">{inc.title}</span>
                        <span className="font-mono text-[9px] text-white/30 uppercase">{inc.service} · {inc.severity}</span>
                      </div>
                      <div className="px-2 py-0.5 rounded border border-white/10 font-barlow text-[9px] text-white/40 uppercase group-hover:border-white/20">{inc.status}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Services Section */}
              {results.services.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 font-bebas text-[11px] tracking-[0.2em] text-white/25 uppercase">System Services</div>
                  {results.services.map(svc => (
                    <div key={svc._id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center bg-white/[0.03] text-white/40 group-hover:text-white/80">
                        <Monitor size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-barlow text-[13px] text-white/75 group-hover:text-white">{svc.service}</span>
                        <span className="font-mono text-[9px] text-white/30 uppercase">{svc.status} · {svc.metrics?.uptime?.toFixed(1)}% uptime</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 h-10 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-white/[0.05] border border-white/10 flex items-center justify-center text-[9px] text-white/30 font-mono">↑↓</span>
              <span className="text-[10px] font-barlow text-white/25 tracking-wide uppercase">Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-white/[0.05] border border-white/10 flex items-center justify-center text-[9px] text-white/30 font-mono">↵</span>
              <span className="text-[10px] font-barlow text-white/25 tracking-wide uppercase">Select</span>
            </div>
          </div>
          <span className="text-[10px] font-barlow text-white/15 tracking-widest uppercase">OpsPulse v2.4.0</span>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
