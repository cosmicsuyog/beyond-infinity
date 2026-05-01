const GhostBtn = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`font-barlow text-[9.5px] tracking-[0.18em] uppercase px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer
      ${danger
        ? "bg-red-500/08 border-red-500/25 text-red-400 hover:bg-red-500/18 hover:border-red-500/50"
        : "bg-white/[0.06] border-white/22 text-white/75 hover:bg-white/[0.13] hover:border-white/45 hover:text-white"
      }`}
  >
    {children}
  </button>
);

export default GhostBtn;
