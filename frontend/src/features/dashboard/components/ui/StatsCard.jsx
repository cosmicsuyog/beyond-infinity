const StatsCard = ({ label, value, change, trend }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-brand-offwhite/60';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <div className="bg-brand-offwhite/5 border border-brand-offwhite/10 rounded-xl p-6 hover:bg-brand-offwhite/10 transition-all">
      <div className="flex-between mb-2">
        <span className="text-brand-offwhite/60 text-sm font-barlow">{label}</span>
        <span className={`text-xs font-barlow ${getTrendColor()}`}>
          {getTrendIcon()} {change}
        </span>
      </div>
      <div className="text-2xl font-bebas text-brand-offwhite">{value}</div>
    </div>
  );
};

export default StatsCard;
