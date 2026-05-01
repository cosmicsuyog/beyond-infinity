import { useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import CustomTooltip from "../ui/CustomTooltip";

const IncidentChart = ({ chartData, loading }) => {
  const [chartToggle, setChartToggle] = useState("Daily");

  return (
    <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors sm:col-span-2 xl:col-span-1">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <span className="font-bebas text-[15px] tracking-[0.14em] text-white">INCIDENTS OVER TIME</span>
        <div className="flex gap-1">
          {["Daily", "Weekly"].map(t => (
            <button
              key={t}
              onClick={() => setChartToggle(t)}
              className={`font-barlow text-[9px] tracking-[0.14em] uppercase px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 ${chartToggle === t ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.03] border-white/10 text-white/45 hover:text-white/70"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 px-4 py-2.5">
        {[{ label: "Opened", color: "#ef4444" }, { label: "Resolved", color: "#22c55e" }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 rounded-full inline-block" style={{ background: l.color }} />
            <span className="font-barlow text-[9px] tracking-[0.12em] uppercase text-white/45">{l.label}</span>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3" style={{ height: 160, width: "100%" }}>
        {loading
          ? <div className="h-full flex items-center justify-center"><div className="w-32 h-24 bg-white/[0.04] animate-pulse rounded" /></div>
          : (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid stroke="rgba(240,240,250,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 8, fill: "rgba(240,240,250,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "rgba(240,240,250,0.3)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="opened" name="Opened" stroke="#ef4444" strokeWidth={1.8} dot={{ r: 3, fill: "#ef4444", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={1.8} dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
      </div>
    </div>
  );
};

export default IncidentChart;
