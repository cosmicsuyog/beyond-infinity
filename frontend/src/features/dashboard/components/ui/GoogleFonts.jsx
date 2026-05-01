const GoogleFonts = () => (
  <style>{`
    /* Dashboard-specific scrollbar styling */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(240,240,250,0.12); border-radius: 2px; }
    
    /* Dashboard-specific scanlines override - different pattern than main */
    .dashboard-scanlines {
      background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(240,240,250,0.012) 3px,rgba(240,240,250,0.012) 4px);
    }
    
    /* Dashboard-specific animations */
    .fade-up { animation: fadeUp 0.4s ease forwards; }
    .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
    .fade-up-2 { animation-delay: 0.10s; opacity: 0; }
    .fade-up-3 { animation-delay: 0.15s; opacity: 0; }
    
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
    
    .sidebar-overlay {
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
    }
  `}</style>
);

export default GoogleFonts;
