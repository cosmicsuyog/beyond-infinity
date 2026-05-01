import { useState, useEffect } from "react";
import { Menu, Calendar, Search } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import SearchOverlay from "./SearchOverlay";

const TopNav = ({ onMenuClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="h-13 min-h-[52px] flex items-center justify-between gap-2 px-4 sm:px-5 border-b border-white/[0.07] bg-white/[0.008]">
        {/* Left side: Mobile Menu */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-8 h-8 flex items-center justify-center border border-white/10 rounded-md bg-white/[0.03] text-white/55 hover:text-white/80 transition"
          >
            <Menu size={15} />
          </button>
        </div>

        {/* Center/Spacer */}
        <div className="hidden lg:flex flex-1" />

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-md px-3 py-1.5 cursor-pointer">
            <Calendar size={11} className="text-white/50" strokeWidth={1.5} />
            <span className="font-barlow text-[9.5px] tracking-[0.14em] uppercase text-white/60">May 18–24, 2025</span>
          </div>
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 border border-white/10 rounded-md flex items-center justify-center cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] transition"
          >
            <Search size={13} className="text-white/55" strokeWidth={1.5} />
          </button>
          
          {/* Dynamic Notifications Dropdown */}
          <NotificationDropdown />
          
          {/* Profile Dropdown on the Right */}
          <ProfileDropdown align="right" />
        </div>
      </div>

      {/* Global Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default TopNav;
