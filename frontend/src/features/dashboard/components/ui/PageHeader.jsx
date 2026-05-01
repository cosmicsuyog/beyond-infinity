const PageHeader = ({ title, subtitle, children }) => (
  <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
    <div>
      <div className="font-bebas text-[26px] sm:text-[32px] tracking-[0.1em] text-white leading-none">{title}</div>
      {subtitle && <div className="font-barlow text-[10px] tracking-[0.16em] uppercase text-white/45 mt-1.5">{subtitle}</div>}
    </div>
    {children && <div className="flex gap-2 flex-wrap">{children}</div>}
  </div>
);

export default PageHeader;
