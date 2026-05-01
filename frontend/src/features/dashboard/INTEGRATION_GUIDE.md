# Frontend-Backend Integration Guide

## Overview

Your OpsPulse dashboard has been fully integrated with all backend APIs while maintaining the existing design system. This guide explains the integration architecture and how to use it.

---

## 📁 Project Structure

### Services Layer

Located in `frontend/src/features/dashboard/service/`:

#### 1. **dashboard.service.js** ✅

Core dashboard and analytics operations

```javascript
// Dashboard Statistics
getDashboardStats() → GET /api/dashboard/stats
getIncidentTrends(days) → GET /api/dashboard/trends

// Error Tracking
getErrorList(filters) → GET /api/errors
getErrorStats() → GET /api/errors/stats

// Timeline
getTimeline(filters) → GET /api/timeline
addTimelineEvent(data) → POST /api/timeline

// Organization
getOrganization() → GET /api/organization
```

#### 2. **incident.service.js** ✅

Complete incident lifecycle management

```javascript
// CRUD Operations
createIncident(data) → POST /api/incidents
getIncidents(filters) → GET /api/incidents?filters
getIncident(id) → GET /api/incidents/:id

// Status & Assignment
updateIncidentStatus(id, status) → PUT /api/incidents/:id/status
assignIncident(id, autoAssign, userIds) → POST /api/incidents/:id/assign

// Analytics
getIncidentStats() → GET /api/incidents/dashboard/stats
```

#### 3. **error.service.js** ✅

Error tracking and analysis

```javascript
getErrors(filters) → GET /api/errors
getError(id) → GET /api/errors/:id
getErrorStats() → GET /api/errors/stats
getErrorsByService(service) → GET /api/errors/service/:service
updateErrorStatus(id, status) → PUT /api/errors/:id/status
linkErrorToIncident(errorId, incidentId) → POST /api/errors/:id/link-incident
```

#### 4. **health.service.js** ✅

System health monitoring

```javascript
getAllHealth() → GET /api/health
getServiceHealth(name) → GET /api/health/:serviceName
getHealthHistory(name, hours) → GET /api/health/:serviceName/history
getHealthMetrics() → GET /api/health/metrics
getHealthOverview() → GET /api/health/overview
updateHealthStatus(name, data) → PUT /api/health/:serviceName
```

#### 5. **timeline.service.js** ✅

Timeline event management

```javascript
getTimeline(filters) → GET /api/timeline
getIncidentTimeline(id, limit) → GET /api/timeline?incidentId=:id
addTimelineEvent(data) → POST /api/timeline
updateTimelineEvent(id, data) → PUT /api/timeline/:id
deleteTimelineEvent(id) → DELETE /api/timeline/:id
getServiceTimeline(service, limit) → GET /api/timeline/service/:service
```

#### 6. **apiKey.service.js** ✅

API key management

```javascript
createApiKey(name, permissions) → POST /api/keys
getAllApiKeys() → GET /api/keys
revokeApiKey(keyId) → DELETE /api/keys/:id
```

---

## 🔄 Redux State Management

### Dashboard Slice (`dashboard.slice.jsx`)

**State Structure:**

```javascript
{
  // Views & Loading
  activeView: "dashboard" | "analytics" | "settings",
  isLoading: boolean,

  // Data Collections
  stats: { incidents, errors, topResponders },
  incidents: [],
  trends: [],
  errors: [],
  errorStats: {},
  healthData: [],
  timeline: [],
  apiKeys: [],

  // Loading States
  loadingStats: boolean,
  loadingIncidents: boolean,
  loadingHealth: boolean,
  loadingTrends: boolean,
  loadingErrors: boolean,
  loadingTimeline: boolean,
}
```

**Async Thunks Available:**

```javascript
// Dashboard
fetchDashboardStats();
fetchIncidentTrends(days);

// Incidents
fetchIncidents(filters);
fetchIncidentStats();
createIncidentThunk(data);
updateIncidentStatusThunk({ id, status });
assignIncidentThunk({ id, autoAssign, userIds });

// Errors
fetchErrors(filters);
fetchErrorStats();

// Health
fetchHealthData();

// Timeline
fetchTimeline(filters);

// API Keys
fetchApiKeys();
createApiKey({ name, permissions });
revokeApiKeyThunk(keyId);
```

---

## 🎨 Components & Views

### Dashboard Views

Located in `frontend/src/features/dashboard/components/views/`:

#### 1. **DashboardView.jsx** ✅

Main dashboard with:

- 📊 4 stat cards (total/active incidents, resolved, critical)
- 📋 Active incidents table (responsive)
- 🏥 System health status
- 📈 Incidents over time chart
- ⚡ System metrics
- 🤖 AI insights panel

#### 2. **AnalyticsView.jsx** ✅

Analytics dashboard with:

- 📈 Request trends (line/bar chart toggle)
- ⏱️ Response time distribution
- 🔗 Endpoint usage breakdown
- 📊 Error type breakdown
- 💚 System health snapshot

#### 3. **SettingsView.jsx** ✅

Multi-tab settings interface:

- 🔒 **Security Tab**: 2FA, API Keys, password change
- 🔔 **Notifications Tab**: Email, Slack, alert severity
- 🎨 **Appearance Tab**: Dark mode, theme customization
- 🔗 **Integrations Tab**: Slack, PagerDuty, GitHub, Webhooks

#### 4. **ApiKeysView.jsx** ✅

API key management with creation and revocation

---

## 📊 Data Transformation

### useDashboardData Hook

Located in `frontend/src/features/dashboard/hooks/useDashboardData.js`

Transforms backend data → UI format:

- **Incidents**: Maps `_id` to `id`, formats assignees as initials
- **Services**: Transforms health records with icon/color mapping
- **Trends**: Converts daily counts to chart format
- **Stats**: Creates stat cards with trend indicators

```javascript
const {
  statCards, // Formatted stat cards
  incidents, // Incident rows
  services, // Health status items
  chartData, // Chart-ready trends
  topResponders, // Top performers
  errorsLast24h, // Error count
  isLoading, // Overall loading state
} = useDashboardData();
```

---

## 🚀 Usage Examples

### Fetching Dashboard Data

```javascript
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchIncidents,
  fetchHealthData,
} from "../../dashboard.slice";

export function MyComponent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch on mount
    dispatch(fetchDashboardStats());
    dispatch(fetchIncidents({ limit: 10, status: "open" }));
    dispatch(fetchHealthData());
  }, [dispatch]);

  const { stats, incidents, loadingStats } = useSelector(
    (state) => state.dashboard
  );

  if (loadingStats) return <LoadingSpinner />;
  return <DashboardContent stats={stats} incidents={incidents} />;
}
```

### Creating an Incident

```javascript
import { createIncidentThunk } from "../../dashboard.slice";

function CreateIncidentForm() {
  const dispatch = useDispatch();

  const handleSubmit = (formData) => {
    dispatch(
      createIncidentThunk({
        title: formData.title,
        description: formData.description,
        service: formData.service,
        severity: formData.severity, // low|medium|high|critical
        tags: formData.tags,
      })
    );
  };

  return <Form onSubmit={handleSubmit} />;
}
```

### Updating Incident Status

```javascript
import { updateIncidentStatusThunk } from "../../dashboard.slice";

function IncidentRow({ incident }) {
  const dispatch = useDispatch();

  const handleStatusChange = (newStatus) => {
    dispatch(
      updateIncidentStatusThunk({
        id: incident._id,
        status: newStatus, // open|investigating|identified|resolved
      })
    );
  };

  return <div onClick={() => handleStatusChange("resolved")}>...</div>;
}
```

### Managing API Keys

```javascript
import { createApiKey, revokeApiKeyThunk } from "../../dashboard.slice";

function ApiKeyManager() {
  const dispatch = useDispatch();
  const { apiKeys } = useSelector((state) => state.dashboard);

  const handleCreateKey = () => {
    dispatch(
      createApiKey({
        name: "Production API",
        permissions: "full",
      })
    );
  };

  const handleRevokeKey = (keyId) => {
    dispatch(revokeApiKeyThunk(keyId));
  };

  return (
    <div>
      {apiKeys.map((key) => (
        <KeyCard key={key.id} item={key} onRevoke={handleRevokeKey} />
      ))}
      <button onClick={handleCreateKey}>Create Key</button>
    </div>
  );
}
```

---

## 🎯 Backend Endpoints Reference

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/verify-otp
```

### Dashboard

```
GET    /api/dashboard/stats        // Dashboard statistics
GET    /api/dashboard/trends       // Incident trends (params: days)
```

### Incidents

```
POST   /api/incidents              // Create incident
GET    /api/incidents              // List incidents (filters: limit, skip, status, severity, service, tags)
GET    /api/incidents/:id          // Get single incident
PUT    /api/incidents/:id/status   // Update status
POST   /api/incidents/:id/assign   // Assign incident
GET    /api/incidents/dashboard/stats // Incident statistics
```

### Errors

```
GET    /api/errors                 // Get errors (filters: limit, skip, hours, severity, service)
GET    /api/errors/:id             // Get single error
GET    /api/errors/stats           // Error statistics
GET    /api/errors/service/:name   // Errors by service
PUT    /api/errors/:id/status      // Update error status
POST   /api/errors/:id/link-incident // Link to incident
```

### Health

```
GET    /api/health                 // All services health
GET    /api/health/:service        // Single service health
GET    /api/health/:service/history // Health history
GET    /api/health/metrics         // Health metrics
GET    /api/health/overview        // Overview
PUT    /api/health/:service        // Update health status
```

### Timeline

```
GET    /api/timeline               // Get timeline (filters: incidentId, limit, skip, type)
POST   /api/timeline               // Add event
PUT    /api/timeline/:id           // Update event
DELETE /api/timeline/:id           // Delete event
GET    /api/timeline/service/:name // Service timeline
```

### API Keys

```
POST   /api/keys                   // Create key
GET    /api/keys                   // Get all keys
DELETE /api/keys/:id               // Revoke key
```

### Organization

```
GET    /api/organization           // Get org data
PUT    /api/organization           // Update org settings
```

---

## 🎨 Design System

All components use your existing design tokens:

**Colors:**

- Primary: `#3b82f6` (Blue)
- Success: `#22c55e` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)
- Background: `#0b0d18` (Dark)

**Typography:**

- Headings: `font-bebas` (tracking-wide)
- Body: `font-barlow` (tracking-normal)
- Mono: `font-mono` (code)

**Components:**

- Stat cards, badges, buttons maintain existing patterns
- Responsive grid system (mobile-first)
- Loading skeletons match design
- Dark theme throughout

---

## 🔧 Configuration

### Environment Variables

Set in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENV=development
```

### CORS & Credentials

All API calls include:

- `credentials: 'include'` for JWT cookies
- `Content-Type: application/json` headers
- Error handling with standardized responses

---

## ✅ Integration Checklist

- [x] Dashboard service with all endpoints
- [x] Incident service with CRUD operations
- [x] Error service with tracking
- [x] Health service for monitoring
- [x] Timeline service for events
- [x] Redux thunks for all operations
- [x] useDashboardData hook with transformations
- [x] DashboardView with real data
- [x] AnalyticsView with charts and metrics
- [x] SettingsView with multi-tab interface
- [x] API Key management
- [x] Loading states and skeletons
- [x] Error handling throughout
- [x] Design system compliance
- [x] Responsive design

---

## 📝 Next Steps

1. **Test API Connectivity**: Verify backend is running on `http://localhost:5000`
2. **Check Redux DevTools**: Install Redux DevTools browser extension
3. **Monitor Network**: Use browser DevTools to inspect API calls
4. **Test Data Flow**: Navigate through dashboard views
5. **Handle Errors**: Implement toast notifications for errors
6. **Add Features**: Create/update incidents, manage API keys

---

## 🐛 Troubleshooting

### API calls failing

- ✓ Verify backend server is running
- ✓ Check VITE_API_BASE_URL is correct
- ✓ Ensure JWT token is valid
- ✓ Check CORS settings on backend

### Data not appearing

- ✓ Open Redux DevTools to check state
- ✓ Use browser Network tab to inspect requests
- ✓ Check backend logs for errors
- ✓ Verify response data structure

### Loading states stuck

- ✓ Check if thunk was dispatched
- ✓ Verify loading state in Redux
- ✓ Check for errors in console
- ✓ Ensure error handlers are set

---

## 📚 Documentation Files

- [API Documentation](../../Docs/COMPLETE_API_DOCUMENTATION.md)
- [Architecture Guide](../../IMPLEMENTATION_SUMMARY.md)
- [Backend Routes](../../backend/src/routes/)

---

**Happy coding! 🚀**
