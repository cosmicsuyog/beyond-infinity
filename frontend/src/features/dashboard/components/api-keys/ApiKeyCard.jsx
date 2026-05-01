import { useDispatch } from 'react-redux';
import { toggleKeyVisibility, revokeApiKey } from '../../dashboard.slice';

const ApiKeyCard = ({ apiKey }) => {
  const dispatch = useDispatch();

  const handleToggleVisibility = () => {
    dispatch(toggleKeyVisibility(apiKey.id));
  };

  const handleRevoke = () => {
    dispatch(revokeApiKey(apiKey.id));
  };

  const displayKey = apiKey.visible ? apiKey.key : `${apiKey.key.substring(0, 8)}...`;

  return (
    <div className={`bg-brand-offwhite/5 border border-brand-offwhite/10 rounded-xl p-6 ${
      !apiKey.active ? 'opacity-60' : ''
    }`}>
      <div className="flex-between mb-4">
        <div>
          <h3 className="text-lg font-bebas text-brand-offwhite">{apiKey.name}</h3>
          <p className="text-brand-offwhite/60 text-sm font-barlow">
            Created: {apiKey.created}
          </p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-barlow ${
          apiKey.active 
            ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
            : 'bg-red-400/20 text-red-400 border border-red-400/30'
        }`}>
          {apiKey.active ? 'ACTIVE' : 'REVOKED'}
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <code className="bg-brand-offwhite/10 px-3 py-1 rounded text-sm text-brand-offwhite font-mono">
          {displayKey}
        </code>
        <button
          onClick={handleToggleVisibility}
          disabled={!apiKey.active}
          className="text-brand-offwhite/60 hover:text-brand-offwhite disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {apiKey.visible ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      <div className="flex-between text-sm">
        <div className="text-brand-offwhite/60">
          <p>Last used: {apiKey.lastUsed}</p>
          <p>Usage: {apiKey.usage} requests</p>
        </div>
        {apiKey.active && (
          <button
            onClick={handleRevoke}
            className="text-red-400 hover:text-red-300 font-barlow"
          >
            REVOKE
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiKeyCard;
