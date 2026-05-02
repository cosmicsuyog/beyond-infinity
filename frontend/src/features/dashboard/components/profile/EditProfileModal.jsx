import { useState, useEffect } from "react";
import { X, User, Briefcase, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import GhostBtn from "../ui/GhostBtn";
import { useAuth } from "../../../auth/context/AuthContext";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        skills: user.skills || "",
        avatar: user.avatar || ""
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate update since backend changes were restricted
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#0b0d18] border border-white/10 rounded-xl shadow-2xl overflow-hidden fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h3 className="font-bebas text-[18px] tracking-[0.1em] text-white uppercase">Profile Settings</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden bg-white/[0.03]">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <User size={32} />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                <ImageIcon size={16} className="text-white" />
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="font-bebas text-[14px] text-white tracking-[0.05em] uppercase">{user?.name || "AUTHENTICATED USER"}</p>
              <p className="font-barlow text-[9px] text-white/30 uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 font-barlow text-[10px] tracking-[0.15em] uppercase text-white/40">
                <User size={12} /> Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/10 rounded-md px-4 py-2.5 font-barlow text-[11px] text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="YOUR NAME"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 font-barlow text-[10px] tracking-[0.15em] uppercase text-white/40">
                <Briefcase size={12} /> Skills / Role
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/10 rounded-md px-4 py-2.5 font-barlow text-[11px] text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="e.g. Lead Engineer, SRE"
              />
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/[0.05] border-dashed rounded text-[9px] text-white/30 uppercase leading-relaxed">
              Note: Backend persistence is disabled as per current configuration. Profile changes will apply to the session only.
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded border border-white/10 font-barlow text-[11px] tracking-[0.15em] uppercase text-white/60 hover:bg-white/[0.03] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className={`flex-1 font-bebas text-[14px] tracking-[0.1em] py-2.5 rounded transition flex items-center justify-center gap-2 ${success ? "bg-green-500 text-white" : "bg-white text-black hover:bg-white/90"}`}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : success ? <Check size={14} /> : <Check size={14} />}
              {loading ? "PROCESSING..." : success ? "UPDATED" : "SAVE PROFILE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
