const badgeStyles = {
  // severity
  critical:      "bg-red-500/15 text-red-400 border border-red-500/30",
  high:          "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  medium:        "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  low:           "bg-white/10 text-white/50 border border-white/15",
  // status
  open:          "bg-red-500/12 text-red-400 border border-red-500/25",
  investigating: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  identified:    "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  monitoring:    "bg-green-500/15 text-green-400 border border-green-500/30",
  resolved:      "bg-green-500/12 text-green-400 border border-green-500/25",
  archived:      "bg-white/8 text-white/30 border border-white/12",
  // health
  up:            "bg-green-500/12 text-green-400 border border-green-500/25",
  down:          "bg-red-500/12 text-red-400 border border-red-500/25",
  degraded:      "bg-yellow-500/12 text-yellow-400 border border-yellow-500/25",
  unknown:       "bg-white/8 text-white/35 border border-white/12",
  // api keys
  full:          "bg-blue-500/10 text-blue-400 border border-blue-500/25",
  read:          "bg-green-500/10 text-green-400 border border-green-500/25",
  write:         "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25",
};

const Badge = ({ type, children }) => (
  <span className={`font-barlow inline-flex items-center px-2 py-0.5 rounded-full text-[9px] tracking-widest uppercase font-semibold ${badgeStyles[type] || ""}`}>
    {children || type}
  </span>
);

export default Badge;
