import { useSelector } from 'react-redux';
import ApiKeyCard from './ApiKeyCard';

const ApiKeysList = () => {
  const { apiKeys } = useSelector((state) => state.dashboard);

  return (
    <div className="space-y-4">
      <div className="flex-between mb-6">
        <h2 className="text-xl font-bebas text-brand-offwhite">API Keys</h2>
        <button className="btn-ghost btn-ghost-sm">
          GENERATE NEW KEY
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {apiKeys.map((apiKey) => (
          <ApiKeyCard key={apiKey.id} apiKey={apiKey} />
        ))}
      </div>
    </div>
  );
};

export default ApiKeysList;
