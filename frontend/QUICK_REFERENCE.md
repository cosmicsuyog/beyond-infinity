# 🎯 Quick Reference - Dashboard Integration

## Common Operations

### Fetch Dashboard Data

```javascript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchIncidents,
  fetchHealthData,
} from "./dashboard.slice";

function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchIncidents({ limit: 10, status: "open" }));
    dispatch(fetchHealthData());
  }, [dispatch]);

  const { stats, incidents, healthData } = useSelector(
    (state) => state.dashboard
  );

  return <div>/* render stats, incidents, health */</div>;
}
```

---

## Create New Incident

```javascript
import { createIncidentThunk } from "./dashboard.slice";

function CreateIncident() {
  const dispatch = useDispatch();

  const handleCreate = () => {
    dispatch(
      createIncidentThunk({
        title: "API Timeout Error",
        description: "High latency on /api/users",
        service: "API Service",
        severity: "high", // low|medium|high|critical
        tags: ["performance", "api"],
      })
    );
  };

  return <button onClick={handleCreate}>Create Incident</button>;
}
```

---

## Update Incident Status

```javascript
import { updateIncidentStatusThunk } from "./dashboard.slice";

const dispatch = useDispatch();

// Change status
dispatch(
  updateIncidentStatusThunk({
    id: "507f1f77bcf86cd799439011", // MongoDB ObjectId
    status: "investigating", // open|investigating|identified|resolved
  })
);
```

---

## Assign Incident

```javascript
import { assignIncidentThunk } from "./dashboard.slice";

const dispatch = useDispatch();

// Auto-assign to best responder
dispatch(
  assignIncidentThunk({
    id: incidentId,
    autoAssign: true,
    userIds: [],
  })
);

// Assign to specific users
dispatch(
  assignIncidentThunk({
    id: incidentId,
    autoAssign: false,
    userIds: ["userId1", "userId2"],
  })
);
```

---

## Get Trends

```javascript
import { fetchIncidentTrends } from "./dashboard.slice";

const dispatch = useDispatch();
const { trends } = useSelector((state) => state.dashboard);

// Fetch trends for last 7 days
dispatch(fetchIncidentTrends(7));

// Result format:
// [
//   { date: "18", opened: 8, resolved: 5 },
//   { date: "19", opened: 14, resolved: 8 },
// ]
```

---

## Get Errors

```javascript
import { fetchErrors } from "./dashboard.slice";

const dispatch = useDispatch();

// With filters
dispatch(
  fetchErrors({
    limit: 50,
    skip: 0,
    hours: 24, // Last 24 hours
    severity: "high",
    service: "database",
  })
);

// Access from state
const { errors, loadingErrors } = useSelector((state) => state.dashboard);
```

---

## Create API Key

```javascript
import { createApiKey } from "./dashboard.slice";

const dispatch = useDispatch();

dispatch(
  createApiKey({
    name: "Production API Key",
    permissions: "full",
  })
);
```

---

## Revoke API Key

```javascript
import { revokeApiKeyThunk } from "./dashboard.slice";

const dispatch = useDispatch();

dispatch(revokeApiKeyThunk(keyId));
```

---

## Toggle Key Visibility

```javascript
import { toggleKeyVisibility } from "./dashboard.slice";

const dispatch = useDispatch();

dispatch(toggleKeyVisibility(keyId));
```

---

## Get Health Data

```javascript
import { fetchHealthData } from "./dashboard.slice";

const dispatch = useDispatch();

dispatch(fetchHealthData());

// Result:
// [
//   {
//     name: "Payment Service",
//     uptime: "99.9%",
//     status: "up", // up|down|degraded
//     Icon: "CreditCard",
//     color: "#3b82f6"
//   }
// ]
```

---

## Get Timeline

```javascript
import { fetchTimeline } from "./dashboard.slice";

const dispatch = useDispatch();

// Get timeline for specific incident
dispatch(
  fetchTimeline({
    incidentId: "507f1f77bcf86cd799439011",
    limit: 50,
  })
);

// Result:
// [
//   {
//     _id: "...",
//     type: "status_change",
//     message: "Status changed to investigating",
//     timestamp: "2024-03-12T14:30:00Z",
//     user: { name: "John Doe" }
//   }
// ]
```

---

## Filter Incidents

```javascript
import { fetchIncidents } from "./dashboard.slice";

const dispatch = useDispatch();

dispatch(
  fetchIncidents({
    limit: 25,
    skip: 0,
    status: "open", // open|investigating|identified|resolved
    severity: "critical", // low|medium|high|critical
    service: "database",
    tags: ["urgent", "database"],
  })
);
```

---

## Using Services Directly

```javascript
import { incidentService } from "./service/incident.service";
import { errorService } from "./service/error.service";
import { healthService } from "./service/health.service";
import { timelineService } from "./service/timeline.service";

// Incident service
await incidentService.createIncident(data);
await incidentService.getIncidents(filters);
await incidentService.updateIncidentStatus(id, status);
await incidentService.assignIncident(id, autoAssign, userIds);

// Error service
await errorService.getErrors(filters);
await errorService.getErrorStats();
await errorService.linkErrorToIncident(errorId, incidentId);

// Health service
await healthService.getAllHealth();
await healthService.getServiceHealth(serviceName);
await healthService.getHealthHistory(serviceName, hours);

// Timeline service
await timelineService.getIncidentTimeline(incidentId);
await timelineService.addTimelineEvent(eventData);
```

---

## Response Status Values

```javascript
// Incident Status
"open" | "investigating" | "identified" | "resolved"

// Incident Severity
"low" | "medium" | "high" | "critical"

// Service Health Status
"up" | "down" | "degraded"

// Badge Types (UI)
"low" → green
"medium" → yellow
"high" → orange
"critical" → red
"up" → green
"down" → red
"degraded" → yellow
```

---

## Loading States

```javascript
const {
  loadingStats, // Dashboard stats loading
  loadingIncidents, // Incidents list loading
  loadingHealth, // Health data loading
  loadingTrends, // Trends loading
  loadingErrors, // Errors loading
  loadingTimeline, // Timeline loading
  isLoading, // Any of the above
} = useSelector((state) => state.dashboard);

// Usage
if (isLoading) return <Skeleton />;
```

---

## Error Handling

```javascript
import { useSelector } from "react-redux";

const { error } = useSelector((state) => state.dashboard);

if (error) {
  return <ErrorAlert message={error} />;
}
```

---

## Access Redux State

```javascript
const {
  stats, // Dashboard statistics
  incidents, // Incidents array
  trends, // Trend data for charts
  healthData, // Service health array
  errors, // Errors array
  errorStats, // Error statistics
  timeline, // Timeline events
  apiKeys, // API keys array
  activeView, // Current active view
  isLoading, // Global loading state
  error, // Global error state
} = useSelector((state) => state.dashboard);
```

---

## Transform Backend Data

```javascript
import { useDashboardData } from "./hooks/useDashboardData";

const {
  statCards, // Formatted stat cards [{ label, val, trend, up, iconName, color }]
  incidents, // Formatted incidents [{ id, title, service, severity, status, assignee, avatarColor }]
  services, // Formatted services [{ name, uptime, status, Icon, color }]
  chartData, // Chart-ready trends [{ date, opened, resolved }]
  topResponders, // Top performers array
  errorsLast24h, // Error count number
  isLoading, // Overall loading state
} = useDashboardData();
```

---

## Environment Variables

```bash
# .env file
VITE_API_BASE_URL=http://localhost:5000
VITE_ENV=development
```

---

## Tips & Tricks

### Refresh All Data

```javascript
const { dispatch } = useDispatch();

const refreshAllData = () => {
  dispatch(fetchDashboardStats());
  dispatch(fetchIncidentTrends(7));
  dispatch(fetchIncidents({ limit: 10, status: "open" }));
  dispatch(fetchHealthData());
};
```

### Conditional Rendering Based on Loading

```javascript
{
  loadingStats ? (
    <div className="grid gap-3">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  ) : (
    <div className="grid gap-3">
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
```

### Combine Multiple Thunks

```javascript
const dispatch = useDispatch();

Promise.all([
  dispatch(fetchDashboardStats()),
  dispatch(fetchIncidents({})),
  dispatch(fetchHealthData()),
]).then(() => {
  console.log("All data loaded!");
});
```

### Use with useEffect

```javascript
useEffect(() => {
  dispatch(
    fetchIncidents({
      limit: 20,
      status: "open",
    })
  );
}, [dispatch, filter]); // Re-fetch when filter changes
```

---

**For more details, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)**
