import StatsCard from './StatsCard';
import { STATS_DATA } from '../dashboard.constants';

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STATS_DATA.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
