import { Sparkles } from "lucide-react";
import GhostBtn from "../ui/GhostBtn";

const AiInsight = ({ topResponders, errorsLast24h, statCards }) => {
  const topResponder = topResponders[0];
  const aiInsightBody = topResponder
    ? `Top responder this week: ${topResponder.user?.name ?? "—"} with ${topResponder.resolved} incidents resolved. Errors in last 24h: ${errorsLast24h}.`
    : `High database latency incidents have increased by 40% in the last 7 days. Peak load detected 14:00–16:00 UTC daily.`;

  const aiRecommendation = topResponder
    ? `Consider auto-assigning critical incidents to ${topResponder.user?.name ?? "top performer"} until team workload balances.`
    : "Check database connections and consider scaling read replicas. Review slow query logs for recent incidents.";

  return (
    <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden flex flex-col transition-colors sm:col-span-2 xl:col-span-1">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
        <Sparkles size={13} className="text-white" strokeWidth={1.5} />
        <span className="font-bebas text-[14px] tracking-[0.14em] text-white">AI INSIGHT</span>
        <span className="font-barlow bg-white/[0.08] border border-white/18 rounded-full text-[8px] tracking-[0.16em] uppercase text-white/25 px-2 py-0.5">BETA</span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="font-barlow text-[11.5px] tracking-[0.07em] text-white/68 leading-relaxed mb-4">
          {aiInsightBody}
        </p>
        <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/25 mb-1.5">Recommended Action</div>
        <p className="font-barlow text-[10.5px] tracking-[0.07em] text-white/50 leading-relaxed mb-4 flex-1">
          {aiRecommendation}
        </p>
        <GhostBtn>VIEW FULL INSIGHT</GhostBtn>
      </div>
    </div>
  );
};

export default AiInsight;
