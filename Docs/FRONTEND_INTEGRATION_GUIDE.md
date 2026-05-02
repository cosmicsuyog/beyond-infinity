# Frontend Integration Guide

> **Wiring the Dashboard** - A step-by-step guide on connecting React components to the OpsPulse backend services.

## Overview
OpsPulse uses a **Service-First Data Flow**. Components should never call `fetch` directly; instead, they interact with the Redux Store, which uses Thunks to communicate with the Service Layer.

---

## 1. Creating a New Service
Services are located in `@/src/features/dashboard/service/`. They encapsulate raw API calls.

```javascript
// service/incident.service.js
import { BaseService } from './base.service';

class IncidentService extends BaseService {
  async getIncidents(filters) {
    return this.request('/api/incidents', { method: 'GET' });
  }
}
export const incidentService = new IncidentService();
```

## 2. Defining State (The Slice)
Register your feature state in `@/src/features/dashboard/dashboard.slice.jsx`.

```javascript
// Define the Thunk
export const fetchIncidents = createAsyncThunk(
  "dashboard/fetchIncidents",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await incidentService.getIncidents(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Handle the state in extraReducers
builder.addCase(fetchIncidents.fulfilled, (state, action) => {
  state.incidents = action.payload;
  state.loading = false;
});
```

## 3. Creating a Custom Hook
Data hooks located in `@/src/features/dashboard/hooks/` abstract the Redux selection and dispatching.

```javascript
// hooks/useIncidents.js
export const useIncidents = () => {
  const dispatch = useDispatch();
  const { incidents, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  return { incidents, loading };
};
```

## 4. Consuming in UI Components
Keep UI components "dumb" by focusing on rendering and passing event handlers.

```javascript
const IncidentList = () => {
  const { incidents, loading } = useIncidents();
  
  if (loading) return <Skeleton />;
  
  return (
    <div>
      {incidents.map(inc => <IncidentCard key={inc.id} data={inc} />)}
    </div>
  );
};
```

---

## 🔐 Authentication Protocol
The frontend automatically handles session persistence via the `AuthService`. 
- **Storage**: JWT is stored in memory; Refresh Token is handled via HttpOnly cookies.
- **Interceptors**: The `BaseService` automatically attaches the `Authorization` header to every request if a token is present.

## 📡 Real-time Updates (WebSockets)
We use `Socket.io` for live incident updates.
- **Socket Manager**: `@/src/features/dashboard/service/socket.service.js`
- **Pattern**: Sockets should dispatch Redux actions directly to update the UI without a full page refresh.

---

> **Tip**: Always use the tactical UI components from `@/src/features/dashboard/components/ui/` to maintain the SpaceX design language.
