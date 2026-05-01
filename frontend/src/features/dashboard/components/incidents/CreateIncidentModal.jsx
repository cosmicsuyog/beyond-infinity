import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import GhostBtn from "../ui/GhostBtn";

const CreateIncidentModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    service: "",
    severity: "low",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Basic validation
    if (!formData.title || !formData.service) {
      setError("Title and Service are required");
      setIsSubmitting(false);
      return;
    }

    const result = await onCreate(formData);
    setIsSubmitting(false);
    
    if (result.success) {
      setFormData({ title: "", service: "", severity: "low", description: "" });
      onClose();
    } else {
      setError(result.error);
    }
  };

  const severities = ["low", "medium", "high", "critical"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px]">
      <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg w-full max-w-md mx-4 relative overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-white/70" />
            <span className="font-bebas text-[18px] tracking-[0.14em] text-white">NEW INCIDENT</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 font-barlow text-[11px] tracking-[0.08em] px-3 py-2 rounded uppercase">
              {error}
            </div>
          )}

          <div>
            <label className="block font-barlow text-[10px] tracking-[0.18em] uppercase text-white/45 mb-1.5">
              Incident Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.07] rounded px-3 py-2 text-white font-barlow text-[12px] tracking-[0.05em] focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
              placeholder="E.g. API Gateway Timeout"
            />
          </div>

          <div>
            <label className="block font-barlow text-[10px] tracking-[0.18em] uppercase text-white/45 mb-1.5">
              Affected Service
            </label>
            <input
              type="text"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.07] rounded px-3 py-2 text-white font-barlow text-[12px] tracking-[0.05em] focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
              placeholder="E.g. Payment Service"
            />
          </div>

          <div>
            <label className="block font-barlow text-[10px] tracking-[0.18em] uppercase text-white/45 mb-2">
              Severity Level
            </label>
            <div className="flex gap-2">
              {severities.map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: sev })}
                  className={`flex-1 font-barlow text-[10px] tracking-[0.1em] uppercase py-1.5 rounded transition-all ${
                    formData.severity === sev 
                      ? "bg-white/10 text-white border border-white/20" 
                      : "bg-white/[0.02] text-white/40 border border-transparent hover:bg-white/[0.05]"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-barlow text-[10px] tracking-[0.18em] uppercase text-white/45 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/[0.07] rounded px-3 py-2 text-white font-barlow text-[12px] tracking-[0.05em] focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20 resize-none h-20"
              placeholder="Provide additional details..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-2 border-t border-white/[0.04] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="font-barlow text-[10px] tracking-[0.18em] uppercase text-white/40 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <GhostBtn onClick={handleSubmit}>
              {isSubmitting ? "CREATING..." : "CREATE INCIDENT"}
            </GhostBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncidentModal;
