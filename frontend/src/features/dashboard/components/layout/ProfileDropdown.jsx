import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Shield, ChevronDown } from "lucide-react";
import { useAuth } from "../../../auth/context/AuthContext";
import EditProfileModal from "../profile/EditProfileModal";

const ProfileDropdown = ({ align = "left" }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1.5 pr-1.5 py-1 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/18 flex items-center justify-center overflow-hidden flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-semibold text-white">
              {(user?.name || user?.email || "US").substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <ChevronDown size={10} className={`text-white/30 transition-transform duration-300 mr-0.5 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 ${align === "right" ? "right-0" : "left-0"} w-48 bg-[#0b0d18] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 fade-in`}>
          <div className="p-3 border-b border-white/[0.07] bg-white/[0.02]">
            <div className="font-bebas text-[11px] tracking-[0.2em] text-white/30 uppercase mb-1">Authenticated As</div>
            <div className="font-barlow text-[10px] text-white truncate">{user?.email || "NOT SIGNED IN"}</div>
          </div>
          
          <div className="p-1.5">
            <button 
              onClick={() => {
                setIsEditModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md font-barlow text-[10.5px] tracking-[0.1em] text-white/70 hover:bg-white/[0.05] hover:text-white transition group"
            >
              <User size={13} className="text-white/40 group-hover:text-white transition" />
              EDIT PROFILE
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md font-barlow text-[10.5px] tracking-[0.1em] text-white/70 hover:bg-white/[0.05] hover:text-white transition group">
              <Settings size={13} className="text-white/40 group-hover:text-white transition" />
              PREFERENCES
            </button>
            {user?.role === 'admin' && (
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md font-barlow text-[10.5px] tracking-[0.1em] text-white/70 hover:bg-white/[0.05] hover:text-white transition group">
                <Shield size={13} className="text-white/40 group-hover:text-white transition" />
                ADMIN CONTROL
              </button>
            )}
          </div>

          <div className="p-1.5 border-t border-white/[0.07]">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md font-barlow text-[10.5px] tracking-[0.1em] text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition group"
            >
              <LogOut size={13} className="text-red-400/40 group-hover:text-red-400 transition" />
              SIGN OUT
            </button>
          </div>
        </div>
      )}

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default ProfileDropdown;
