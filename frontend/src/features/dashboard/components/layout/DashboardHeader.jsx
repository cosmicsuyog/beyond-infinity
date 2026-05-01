import { useSelector, useDispatch } from 'react-redux';
import { setActiveView } from '../../dashboard.slice';
import { DASHBOARD_VIEWS } from '../../dashboard.constants';

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const { activeView } = useSelector((state) => state.dashboard);

  return (
    <header className="bg-brand-bg border-b border-brand-offwhite/10 px-6 py-4">
      <div className="flex-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bebas text-brand-offwhite">OpsPulse</h1>
          <span className="text-brand-offwhite/60 text-sm">Dashboard</span>
        </div>
        
        <nav className="flex space-x-1">
          {DASHBOARD_VIEWS.map((view) => (
            <button
              key={view.id}
              onClick={() => dispatch(setActiveView(view.id))}
              className={`px-4 py-2 rounded-lg text-sm font-barlow transition-all ${
                activeView === view.id
                  ? 'bg-brand-offwhite/20 text-brand-offwhite border border-brand-offwhite/30'
                  : 'text-brand-offwhite/60 hover:text-brand-offwhite hover:bg-brand-offwhite/10'
              }`}
            >
              {view.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
