import { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Building,
  Mail,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createApiKey,
  revokeApiKeyThunk,
  toggleKeyVisibility,
} from "../../dashboard.slice";
import { useOrganization } from "../settings/useOrganization";
import PageHeader from "../ui/PageHeader";
import GhostBtn from "../ui/GhostBtn";
import Badge from "../ui/Badge";

const Skeleton = ({ w = "w-24", h = "h-3" }) => (
  <div className={`${w} ${h} rounded bg-white/[0.06] animate-pulse`} />
);

const SettingsView = () => {
  const dispatch = useDispatch();
  const { apiKeys, isCreatingKey } = useSelector((state) => state.dashboard);
  const {
    organization,
    loading: loadingOrg,
    updating: updatingOrg,
    updateOrg,
  } = useOrganization();

  const [activeTab, setActiveTab] = useState("organization");
  const [newKeyName, setNewKeyName] = useState("");
  const [orgForm, setOrgForm] = useState({
    name: "",
    description: "",
    contactEmail: "",
  });

  // Sync orgForm when organization data loads
  useEffect(() => {
    if (organization) {
      const syncForm = async () => {
        await Promise.resolve();
        setOrgForm({
          name: organization.name || "",
          description: organization.description || "",
          contactEmail: organization.contactEmail || "",
        });
      };
      syncForm();
    }
  }, [organization]);

  const [settings, setSettings] = useState({
    notificationsEmail: true,
    notificationsSlack: false,
    alertsCritical: true,
    alertsHigh: true,
    alertsMedium: false,
    darkMode: true,
    twoFactor: false,
  });

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    dispatch(createApiKey({ name: newKeyName }));
    setNewKeyName("");
  };

  const handleToggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRevokeKey = (keyId) => {
    if (
      confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone."
      )
    ) {
      dispatch(revokeApiKeyThunk(keyId));
    }
  };

  const handleUpdateOrg = async (e) => {
    e.preventDefault();
    const result = await updateOrg(orgForm);
    if (result.success) {
      alert("Organization profile updated successfully");
    } else {
      alert("Error: " + result.error);
    }
  };

  const tabs = [
    { id: "organization", label: "Organization", icon: <Building size={12} /> },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "integrations", label: "Integrations", icon: "🔗" },
  ];

  const activeKeys = apiKeys.filter((k) => k.active);

  return (
    <div className="space-y-6">
      <PageHeader
        title="SETTINGS"
        subtitle="Manage your account, security, and preferences"
      />

      {/* ── TABS ──────────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-white/[0.07] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 font-barlow text-[9px] tracking-[0.14em] uppercase px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "border-white/50 text-white"
                : "border-transparent text-white/45 hover:text-white/70"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ORGANIZATION TAB ──────────────────────────────────── */}
      {activeTab === "organization" && (
        <div className="space-y-6 fade-in">
          <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-6 transition-colors">
            <h3 className="font-bebas text-[15px] tracking-[0.14em] text-white mb-6">
              ORGANIZATION PROFILE
            </h3>

            {loadingOrg ? (
              <div className="space-y-4">
                <Skeleton w="w-full" h="h-10" />
                <Skeleton w="w-full" h="h-20" />
                <Skeleton w="w-full" h="h-10" />
              </div>
            ) : (
              <form onSubmit={handleUpdateOrg} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-barlow text-[10px] tracking-[0.1em] uppercase text-white/45">
                      <Building size={10} /> Organization Name
                    </label>
                    <input
                      type="text"
                      value={orgForm.name}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, name: e.target.value })
                      }
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-3 py-2.5 font-barlow text-[11px] text-white focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-barlow text-[10px] tracking-[0.1em] uppercase text-white/45">
                      <Mail size={10} /> Contact Email
                    </label>
                    <input
                      type="email"
                      value={orgForm.contactEmail}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, contactEmail: e.target.value })
                      }
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-3 py-2.5 font-barlow text-[11px] text-white focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="billing@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-barlow text-[10px] tracking-[0.1em] uppercase text-white/45">
                    <FileText size={10} /> Description
                  </label>
                  <textarea
                    value={orgForm.description}
                    onChange={(e) =>
                      setOrgForm({ ...orgForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-3 py-2.5 font-barlow text-[11px] text-white focus:outline-none focus:border-white/20 transition-colors resize-none"
                    placeholder="Brief description of your organization"
                  />
                </div>

                <div className="pt-2">
                  <GhostBtn type="submit" disabled={updatingOrg}>
                    <Save size={10} className="inline mr-1.5" />
                    {updatingOrg ? "SAVING..." : "SAVE CHANGES"}
                  </GhostBtn>
                </div>
              </form>
            )}
          </div>

          <div className="bg-white/[0.02] border border-white/[0.07] border-dashed rounded-lg p-6 flex flex-col items-center text-center">
            <div className="font-bebas text-[14px] tracking-[0.14em] text-white/30 mb-2">
              Organization ID
            </div>
            <div className="font-mono text-[11px] text-white/60 bg-white/[0.05] px-4 py-2 rounded border border-white/[0.1]">
              {organization?._id || "---"}
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY TAB ──────────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="space-y-6 fade-in">
          <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-6 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bebas text-[15px] tracking-[0.14em] text-white mb-1">
                  TWO-FACTOR AUTHENTICATION
                </h3>
                <p className="font-barlow text-[10px] tracking-[0.08em] text-white/45">
                  Enhance security with two-factor authentication
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-[8px] font-barlow tracking-[0.1em] uppercase ${
                  settings.twoFactor
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/[0.05] text-white/45 border border-white/[0.1]"
                }`}
              >
                {settings.twoFactor ? "ENABLED" : "DISABLED"}
              </div>
            </div>
            <GhostBtn onClick={() => handleToggleSetting("twoFactor")}>
              {settings.twoFactor ? "DISABLE 2FA" : "ENABLE 2FA"}
            </GhostBtn>
          </div>

          <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-6 transition-colors">
            <h3 className="font-bebas text-[15px] tracking-[0.14em] text-white mb-4">
              API KEYS
            </h3>

            <div className="mb-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key name (e.g., Production API)"
                  className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded px-3 py-2 font-barlow text-[11px] text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                />
                <GhostBtn
                  onClick={handleCreateKey}
                  disabled={isCreatingKey || !newKeyName.trim()}
                >
                  <Plus size={10} className="inline mr-1" />
                  {isCreatingKey ? "Creating..." : "CREATE"}
                </GhostBtn>
              </div>
              <p className="font-barlow text-[8px] tracking-[0.08em] text-white/35">
                API keys are used for error intake and integrations
              </p>
            </div>

            {activeKeys.length > 0 && (
              <div className="mb-6">
                <h4 className="font-barlow text-[10px] tracking-[0.2em] uppercase text-white/45 mb-3">
                  Active Keys ({activeKeys.length})
                </h4>
                <div className="space-y-2">
                  {activeKeys.map((key) => (
                    <div
                      key={key.id}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 flex items-center justify-between group hover:border-white/[0.1] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-barlow text-[11px] tracking-[0.08em] text-white mb-1">
                          {key.name}
                        </div>
                        <div className="font-mono text-[9px] text-white/40 truncate">
                          {key.visible
                            ? key.key
                            : `••••••••${key.key.slice(-8)}`}
                        </div>
                        <div className="font-barlow text-[8px] tracking-[0.1em] text-white/30 mt-1">
                          Created: {key.created} • Last used: {key.lastUsed}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <button
                          onClick={() => dispatch(toggleKeyVisibility(key.id))}
                          className="text-white/40 hover:text-white/70 transition p-1"
                          title={key.visible ? "Hide" : "Show"}
                        >
                          {key.visible ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="text-white/40 hover:text-red-400 transition p-1 opacity-0 group-hover:opacity-100"
                          title="Revoke"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ──────────────────────────────── */}
      {activeTab === "notifications" && (
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-6 transition-colors fade-in">
          <div className="space-y-4">
            <h3 className="font-bebas text-[15px] tracking-[0.14em] text-white mb-6">
              NOTIFICATION CHANNELS
            </h3>

            {[
              {
                key: "notificationsEmail",
                label: "Email Notifications",
                desc: "Receive alerts via email",
              },
              {
                key: "notificationsSlack",
                label: "Slack Integration",
                desc: "Get alerts in Slack channels",
              },
            ].map((channel) => (
              <div
                key={channel.key}
                className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.04] rounded"
              >
                <div>
                  <div className="font-barlow text-[11px] tracking-[0.08em] text-white">
                    {channel.label}
                  </div>
                  <div className="font-barlow text-[9px] text-white/40">
                    {channel.desc}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings[channel.key]}
                  onChange={() => handleToggleSetting(channel.key)}
                  className="w-4 h-4 rounded cursor-pointer accent-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── APPEARANCE TAB ──────────────────────────────────── */}
      {activeTab === "appearance" && (
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-6 transition-colors fade-in">
          <h3 className="font-bebas text-[15px] tracking-[0.14em] text-white mb-6">
            APPEARANCE SETTINGS
          </h3>
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded">
            <div>
              <div className="font-barlow text-[11px] tracking-[0.08em] text-white">
                Dark Mode
              </div>
              <div className="font-barlow text-[9px] text-white/40">
                Use dark theme by default
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => handleToggleSetting("darkMode")}
              className="w-4 h-4 rounded cursor-pointer accent-white"
            />
          </div>
        </div>
      )}

      {/* ── INTEGRATIONS TAB ──────────────────────────────── */}
      {activeTab === "integrations" && (
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-6 transition-colors fade-in">
          <h3 className="font-bebas text-[15px] tracking-[0.14em] text-white mb-6">
            INTEGRATIONS
          </h3>
          <div className="space-y-4">
            {[
              { name: "Slack", status: "connected", icon: "💬" },
              { name: "PagerDuty", status: "not_connected", icon: "🚨" },
              { name: "GitHub", status: "not_connected", icon: "🐙" },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{integration.icon}</span>
                  <div>
                    <div className="font-barlow text-[11px] tracking-[0.08em] text-white">
                      {integration.name}
                    </div>
                    <div
                      className={`font-barlow text-[9px] ${
                        integration.status === "connected"
                          ? "text-green-400"
                          : "text-white/40"
                      }`}
                    >
                      {integration.status === "connected"
                        ? "✓ Connected"
                        : "Not connected"}
                    </div>
                  </div>
                </div>
                <GhostBtn>
                  {integration.status === "connected" ? "MANAGE" : "CONNECT"}
                </GhostBtn>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
