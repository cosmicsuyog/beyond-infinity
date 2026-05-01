import { useState } from "react";
import { 
  Sparkles, Brain, Zap, Search, AlertTriangle, 
  CheckCircle, MessageSquare, BarChart3, Bot
} from "lucide-react";
import PageHeader from "../ui/PageHeader";
import GhostBtn from "../ui/GhostBtn";
import Badge from "../ui/Badge";
import { useAi } from "./useAi";
import { useIncidents } from "../incidents/useIncidents";

const AiInsightsView = () => {
  const { incidents } = useIncidents();
  const { loading, error, getSummary, getRootCause } = useAi();
  
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  const handleAnalyze = async () => {
    if (!selectedIncident) return;
    
    // In a real app, we'd fetch actual logs/context for this incident
    const context = "Service: " + selectedIncident.service + ". Title: " + selectedIncident.title;
    
    if (activeTab === "summary") {
      const res = await getSummary(selectedIncident._id, context);
      if (res.success) setAnalysis(res.data);
    } else {
      const res = await getRootCause(selectedIncident._id, context);
      if (res.success) setAnalysis(res.data);
    }
  };

  return (
    <>
      <PageHeader title="AI INSIGHTS" subtitle="Predictive analytics and automated incident orchestration">
        <span className="font-barlow bg-white/[0.08] border border-white/18 rounded-full text-[8px] tracking-[0.16em] uppercase text-white/45 px-3 py-1">GEN-AI POWERED</span>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Selection & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search size={14} className="text-white/40" />
              <h3 className="font-bebas text-[16px] tracking-[0.12em] text-white uppercase">Select Incident</h3>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {incidents.length === 0 ? (
                <div className="text-center py-8 font-barlow text-[10px] uppercase text-white/20">No active incidents</div>
              ) : (
                incidents.map(inc => (
                  <div 
                    key={inc._id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-3 rounded-md border cursor-pointer transition-all ${selectedIncident?._id === inc._id ? "bg-white/[0.08] border-white/20" : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]"}`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-mono text-[9px] text-white/30 uppercase">INC-{inc._id?.slice(-4).toUpperCase()}</span>
                      <Badge type={inc.severity}>{inc.severity}</Badge>
                    </div>
                    <div className="font-barlow text-[11px] tracking-[0.05em] text-white/80 uppercase truncate">{inc.title}</div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex gap-2">
                {["summary", "root-cause"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 font-barlow text-[9px] tracking-[0.15em] uppercase py-2 rounded border transition-all ${activeTab === tab ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white/60"}`}
                  >
                    {tab.replace("-", " ")}
                  </button>
                ))}
              </div>
              <button 
                disabled={!selectedIncident || loading}
                onClick={handleAnalyze}
                className="w-full bg-white text-black font-bebas text-[14px] tracking-[0.1em] py-2.5 rounded hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {loading ? "PROCESSING..." : "GENERATE INSIGHT"}
              </button>
            </div>
          </div>

          {/* AI Stats */}
          <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-5">
            <div className="font-bebas text-[14px] tracking-[0.12em] text-white/40 uppercase mb-4">Orchestration Metrics</div>
            <div className="space-y-4">
              {[
                { label: "Auto-summarized", val: "94%", icon: MessageSquare },
                { label: "Root Cause Accuracy", val: "82%", icon: Brain },
                { label: "Prediction Confidence", val: "88%", icon: BarChart3 }
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-barlow text-[10px] tracking-[0.1em] uppercase text-white/50">
                    <stat.icon size={12} /> {stat.label}
                  </div>
                  <div className="font-bebas text-[16px] text-white">{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Output & Insights */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Analysis Result */}
          <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg min-h-[400px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <Bot size={200} />
            </div>
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/10">
                  <Brain size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bebas text-[18px] tracking-[0.1em] text-white uppercase">Analysis Workbench</h3>
                  <div className="font-barlow text-[9px] tracking-[0.2em] text-white/30 uppercase">Intelligent Diagnostics</div>
                </div>
              </div>
              {analysis && (
                <div className="flex items-center gap-2 font-barlow text-[9px] tracking-[0.15em] text-green-400 uppercase">
                  <CheckCircle size={10} /> Analysis Complete
                </div>
              )}
            </div>

            <div className="p-8 flex-1">
              {!selectedIncident ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 border border-white/[0.05]">
                    <Zap size={24} className="text-white/10" />
                  </div>
                  <p className="font-barlow text-[11px] tracking-[0.15em] uppercase text-white/20 max-w-[200px]">
                    Select an active incident from the list to begin AI orchestration
                  </p>
                </div>
              ) : !analysis ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Bot size={40} className="text-white/10 mb-4 animate-bounce" />
                  <p className="font-barlow text-[11px] tracking-[0.15em] uppercase text-white/30">
                    Ready to analyze INC-{selectedIncident._id?.slice(-4).toUpperCase()}
                  </p>
                  <p className="font-barlow text-[9px] tracking-[0.1em] text-white/20 mt-1 uppercase">
                    Select mode and click Generate Insight
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-w-2xl">
                  <div className="fade-in">
                    <div className="font-bebas text-[13px] tracking-[0.2em] text-white/40 uppercase mb-3 border-l-2 border-white/20 pl-3">
                      AI Generated {activeTab === "summary" ? "Summary" : "Root Cause"}
                    </div>
                    <p className="font-barlow text-[14px] tracking-[0.06em] text-white/80 leading-relaxed bg-white/[0.02] p-4 rounded-lg border border-white/[0.05]">
                      {analysis.summary || analysis.suggestion || (typeof analysis === 'string' ? analysis : JSON.stringify(analysis))}
                    </p>
                  </div>

                  {activeTab === "summary" && (
                    <div className="fade-in delay-100 grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-md p-4">
                        <div className="font-barlow text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">Confidence Level</div>
                        <div className="font-bebas text-[20px] text-white">92%</div>
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-md p-4">
                        <div className="font-barlow text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">Estimated TTR</div>
                        <div className="font-bebas text-[20px] text-white">14 Mins</div>
                      </div>
                    </div>
                  )}

                  <div className="fade-in delay-200 pt-4 border-t border-white/[0.07]">
                    <div className="font-bebas text-[13px] tracking-[0.2em] text-white/40 uppercase mb-4">Recommended Next Steps</div>
                    <ul className="space-y-3">
                      {[
                        "Verify recent deployment #D-2244 consistency",
                        "Scale Auth-Service replicas in EU-WEST-1",
                        "Flush Redis cache for session-cluster-04"
                      ].map((step, i) => (
                        <li key={i} className="flex items-center gap-3 font-barlow text-[11px] tracking-[0.05em] text-white/60 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.07] flex justify-between items-center">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                AI Engine: OPS-LENS-V1
              </div>
              <div className="flex gap-3">
                <GhostBtn disabled={!analysis}>EXPORT REPORT</GhostBtn>
                <GhostBtn disabled={!analysis}>COPY TO SLACK</GhostBtn>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

// Re-importing missing icons
import { RefreshCw } from "lucide-react";

export default AiInsightsView;
