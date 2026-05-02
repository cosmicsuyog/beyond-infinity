import { useState, useRef, useEffect } from "react";
import { Bell, Check, AlertCircle, Info, Zap } from "lucide-react";
import { notificationService } from "../../service/notification.service";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response.success) {
        setNotifications(notifications.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        ));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    switch (type) {
      case "incident": return <AlertCircle size={14} className="text-red-400" />;
      case "system": return <Zap size={14} className="text-yellow-400" />;
      case "info": return <Info size={14} className="text-blue-400" />;
      default: return <Bell size={14} className="text-white/40" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 border border-white/10 rounded-md flex items-center justify-center cursor-pointer transition relative ${isOpen ? "bg-white/[0.1] border-white/20" : "bg-white/[0.03] hover:bg-white/[0.08]"}`}
      >
        <Bell size={13} className={unreadCount > 0 ? "text-white" : "text-white/55"} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[7px] flex items-center justify-center text-white font-semibold border-[1.5px] border-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-[#0b0d18] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 fade-in">
          <div className="px-4 py-3 border-b border-white/[0.07] bg-white/[0.01] flex items-center justify-between">
            <div className="font-bebas text-[13px] tracking-[0.1em] text-white uppercase">Notifications</div>
            {unreadCount > 0 && (
              <span className="font-barlow text-[9px] text-white/30 uppercase tracking-widest">{unreadCount} Unread</span>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-2" />
                <span className="font-barlow text-[10px] text-white/20 uppercase tracking-widest">Scanning Signal...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors relative group ${!n.isRead ? "bg-white/[0.01]" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`font-barlow text-[11px] font-medium uppercase tracking-wide truncate ${!n.isRead ? "text-white" : "text-white/60"}`}>
                          {n.title}
                        </span>
                        <span className="font-barlow text-[8px] text-white/20 flex-shrink-0">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="font-barlow text-[10px] text-white/40 leading-relaxed mb-2">
                        {n.message}
                      </p>
                      {!n.isRead && (
                        <button 
                          onClick={() => handleMarkRead(n._id)}
                          className="flex items-center gap-1.5 font-barlow text-[9px] text-white/30 hover:text-white transition uppercase tracking-widest"
                        >
                          <Check size={10} /> Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                  {!n.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Bell size={24} className="mx-auto text-white/5 mb-3" />
                <div className="font-bebas text-[14px] text-white/20 tracking-widest uppercase">Signal Clear</div>
                <p className="font-barlow text-[9px] text-white/10 uppercase mt-1 tracking-wider">No new notifications</p>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-white/[0.07] bg-white/[0.01]">
            <button className="w-full py-2 rounded font-barlow text-[10px] text-white/30 hover:text-white hover:bg-white/[0.03] transition uppercase tracking-[0.2em]">
              View All Signals
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
