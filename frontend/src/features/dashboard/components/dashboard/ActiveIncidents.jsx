import Badge from "../ui/Badge";

const Skeleton = ({ w = "w-24", h = "h-3" }) => (
  <div className={`${w} ${h} rounded bg-white/[0.06] animate-pulse`} />
);

const ActiveIncidents = ({ incidents, loading }) => {
  return (
    <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <span className="font-bebas text-[15px] tracking-[0.14em] text-white">ACTIVE INCIDENTS</span>
        <span className="font-barlow text-[9.5px] tracking-[0.14em] uppercase text-white/45 cursor-pointer hover:text-white/70 transition">View all →</span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ID", "TITLE", "SERVICE", "SEVERITY", "STATUS", "ASSIGNED"].map(h => (
                <th key={h} className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/30 px-4 py-2.5 text-left border-b border-white/[0.07] bg-white/[0.02] font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [0, 1, 2].map(i => (
                  <tr key={i}>
                    {[0, 1, 2, 3, 4, 5].map(j => (
                      <td key={j} className="px-4 py-3"><Skeleton w={j === 1 ? "w-36" : "w-16"} /></td>
                    ))}
                  </tr>
                ))
              : incidents.map(inc => (
                  <tr key={inc.id} className="hover:bg-white/[0.025] transition-colors">
                    <td className="px-4 py-3 font-mono text-[10px] text-white/45">{inc.id}</td>
                    <td className="px-4 py-3 font-barlow text-[11px] tracking-[0.08em] text-white/78">{inc.title}</td>
                    <td className="px-4 py-3 font-barlow text-[10px] tracking-[0.08em] text-white/45">{inc.service}</td>
                    <td className="px-4 py-3"><Badge type={inc.severity}>{inc.severity}</Badge></td>
                    <td className="px-4 py-3"><Badge type={inc.status}>{inc.status}</Badge></td>
                    <td className="px-4 py-3">
                      <span
                        className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[9px] font-semibold"
                        style={{ background: `${inc.avatarColor}22`, color: inc.avatarColor, border: `1px solid ${inc.avatarColor}44` }}
                      >
                        {inc.assignee}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Mobile incident cards */}
      <div className="md:hidden divide-y divide-white/[0.04]">
        {loading
          ? [0, 1, 2].map(i => (
              <div key={i} className="px-4 py-3 space-y-2">
                <Skeleton w="w-40" h="h-3" />
                <Skeleton w="w-24" h="h-2" />
                <div className="flex gap-2"><Skeleton w="w-14" h="h-4" /><Skeleton w="w-16" h="h-4" /></div>
              </div>
            ))
          : incidents.map(inc => (
              <div key={inc.id} className="px-4 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-barlow text-[11px] tracking-[0.08em] text-white/85 mb-0.5">{inc.title}</div>
                    <div className="font-mono text-[9px] text-white/35">{inc.id} · {inc.service}</div>
                  </div>
                  <span
                    className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[9px] font-semibold ml-2 flex-shrink-0"
                    style={{ background: `${inc.avatarColor}22`, color: inc.avatarColor, border: `1px solid ${inc.avatarColor}44` }}
                  >
                    {inc.assignee}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge type={inc.severity}>{inc.severity}</Badge>
                  <Badge type={inc.status}>{inc.status}</Badge>
                </div>
              </div>
            ))}
      </div>

      {!loading && incidents.length === 0 && (
        <div className="px-4 py-8 text-center font-barlow text-[10px] tracking-[0.18em] uppercase text-white/25">
          No active incidents — systems operational
        </div>
      )}
    </div>
  );
};

export default ActiveIncidents;
