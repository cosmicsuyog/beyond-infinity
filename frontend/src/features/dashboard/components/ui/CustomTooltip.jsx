const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="font-barlow bg-[#0d0f1a] border border-white/[0.07] rounded-md px-3 py-2 text-[10px] tracking-widest">
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }} className="uppercase mb-0.5 last:mb-0">{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default CustomTooltip;
