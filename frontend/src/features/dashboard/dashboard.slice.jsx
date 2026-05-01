import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { INITIAL_KEYS } from "./dashboard.constants";
import { apiKeyService } from "./service/apiKey.service";
import { dashboardService } from "./service/dashboard.service";

const initialState = {
  activeView: "dashboard",
  apiKeys: INITIAL_KEYS,
  isLoading: false,
  isCreatingKey: false,
  error: null,
  // Granular loading states per data section
  loadingStats: false,
  loadingIncidents: false,
  loadingHealth: false,
  loadingTrends: false,
  loadingErrors: false,
  loadingTimeline: false,
  // Dashboard stats
  stats: {
    incidents: {
      total: 0,
      open: 0,
      critical: 0,
      resolvedLast7Days: 0,
      avgResolutionTime: 0,
    },
    errors: { total: 0, last24h: 0 },
    topResponders: [],
  },
  // Incidents
  incidents: [],
  incidentStats: null,
  // Health
  healthData: [],
  // Trends
  trends: [],
  // Errors
  errors: [],
  errorStats: null,
  // Timeline
  timeline: [],
  // System Metrics
  system: {
    metrics: null,
    health: null,
    dbStatus: null,
  },
  loadingSystem: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    addApiKey: (state, action) => {
      state.apiKeys.unshift(action.payload);
    },
    revokeApiKey: (state, action) => {
      const key = state.apiKeys.find((k) => k.id === action.payload);
      if (key) {
        key.active = false;
        key.visible = false;
      }
    },
    toggleKeyVisibility: (state, action) => {
      const key = state.apiKeys.find((k) => k.id === action.payload);
      if (key && key.active) {
        key.visible = !key.visible;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCreatingKey: (state, action) => {
      state.isCreatingKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch API keys
      .addCase(fetchApiKeys.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApiKeys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.apiKeys = action.payload;
      })
      .addCase(fetchApiKeys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create API key
      .addCase(createApiKey.pending, (state) => {
        state.isCreatingKey = true;
        state.error = null;
      })
      .addCase(createApiKey.fulfilled, (state, action) => {
        state.isCreatingKey = false;
        state.apiKeys.unshift(action.payload);
      })
      .addCase(createApiKey.rejected, (state, action) => {
        state.isCreatingKey = false;
        state.error = action.payload;
      })
      // Revoke API key
      .addCase(revokeApiKeyThunk.fulfilled, (state, action) => {
        const key = state.apiKeys.find((k) => k.id === action.payload);
        if (key) {
          key.active = false;
          key.visible = false;
        }
      })
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loadingStats = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.loadingStats = false;
      })
      // Fetch incident trends
      .addCase(fetchIncidentTrends.pending, (state) => {
        state.loadingTrends = true;
      })
      .addCase(fetchIncidentTrends.fulfilled, (state, action) => {
        state.loadingTrends = false;
        state.trends = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchIncidentTrends.rejected, (state) => {
        state.loadingTrends = false;
      })
      // Fetch incidents list
      .addCase(fetchIncidents.pending, (state) => {
        state.loadingIncidents = true;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loadingIncidents = false;
        state.incidents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchIncidents.rejected, (state) => {
        state.loadingIncidents = false;
      })
      // Fetch incident stats
      .addCase(fetchIncidentStats.fulfilled, (state, action) => {
        state.incidentStats = action.payload;
      })
      // Fetch health data
      .addCase(fetchHealthData.pending, (state) => {
        state.loadingHealth = true;
      })
      .addCase(fetchHealthData.fulfilled, (state, action) => {
        state.loadingHealth = false;
        state.healthData = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchHealthData.rejected, (state) => {
        state.loadingHealth = false;
      })
      // Fetch errors
      .addCase(fetchErrors.pending, (state) => {
        state.loadingErrors = true;
      })
      .addCase(fetchErrors.fulfilled, (state, action) => {
        state.loadingErrors = false;
        state.errors = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchErrors.rejected, (state) => {
        state.loadingErrors = false;
      })
      // Fetch error stats
      .addCase(fetchErrorStats.fulfilled, (state, action) => {
        state.errorStats = action.payload;
      })
      // Fetch timeline
      .addCase(fetchTimeline.pending, (state) => {
        state.loadingTimeline = true;
      })
      .addCase(fetchTimeline.fulfilled, (state, action) => {
        state.loadingTimeline = false;
        state.timeline = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTimeline.rejected, (state) => {
        state.loadingTimeline = false;
      })
      // Fetch system data
      .addCase(fetchSystemData.pending, (state) => {
        state.loadingSystem = true;
      })
      .addCase(fetchSystemData.fulfilled, (state, action) => {
        state.loadingSystem = false;
        state.system = action.payload;
      })
      .addCase(fetchSystemData.rejected, (state) => {
        state.loadingSystem = false;
      });
  },
});

export const {
  setActiveView,
  addApiKey,
  revokeApiKey,
  toggleKeyVisibility,
  setError,
  setLoading,
  setCreatingKey,
} = dashboardSlice.actions;

// Async thunks for API key operations
export const fetchApiKeys = createAsyncThunk(
  "dashboard/fetchApiKeys",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiKeyService.getAllApiKeys();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch API keys");
    }
  }
);

export const createApiKey = createAsyncThunk(
  "dashboard/createApiKey",
  async ({ name, permissions }, { rejectWithValue }) => {
    try {
      const response = await apiKeyService.createApiKey(name, permissions);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create API key");
    }
  }
);

export const revokeApiKeyThunk = createAsyncThunk(
  "dashboard/revokeApiKey",
  async (keyId, { rejectWithValue }) => {
    try {
      await apiKeyService.revokeApiKey(keyId);
      return keyId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to revoke API key");
    }
  }
);

// Dashboard data thunks
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboardStats();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const fetchIncidentTrends = createAsyncThunk(
  "dashboard/fetchIncidentTrends",
  async (days = 7, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getIncidentTrends(days);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch incident trends"
      );
    }
  }
);

export const fetchIncidents = createAsyncThunk(
  "dashboard/fetchIncidents",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getIncidents(filters);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch incidents");
    }
  }
);

export const fetchIncidentStats = createAsyncThunk(
  "dashboard/fetchIncidentStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getIncidentStats();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch incident stats");
    }
  }
);

export const fetchHealthData = createAsyncThunk(
  "dashboard/fetchHealthData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getAllHealth();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch health data");
    }
  }
);

// Create incident
export const createIncidentThunk = createAsyncThunk(
  "dashboard/createIncident",
  async (incidentData, { rejectWithValue }) => {
    try {
      const response = await dashboardService.createIncident(incidentData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create incident");
    }
  }
);

// Update incident status
export const updateIncidentStatusThunk = createAsyncThunk(
  "dashboard/updateIncidentStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await dashboardService.updateIncidentStatus(id, status);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update incident status"
      );
    }
  }
);

// Assign incident
export const assignIncidentThunk = createAsyncThunk(
  "dashboard/assignIncident",
  async ({ id, autoAssign, userIds }, { rejectWithValue }) => {
    try {
      const response = await dashboardService.assignIncident(
        id,
        autoAssign,
        userIds
      );
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to assign incident");
    }
  }
);

// Fetch errors
export const fetchErrors = createAsyncThunk(
  "dashboard/fetchErrors",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getErrorList(filters);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch errors");
    }
  }
);

// Fetch error stats
export const fetchErrorStats = createAsyncThunk(
  "dashboard/fetchErrorStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getErrorStats();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch error stats");
    }
  }
);

// Fetch timeline
export const fetchTimeline = createAsyncThunk(
  "dashboard/fetchTimeline",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getTimeline(filters);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch timeline");
    }
  }
);

export const fetchSystemData = createAsyncThunk(
  "dashboard/fetchSystemData",
  async (_, { rejectWithValue }) => {
    try {
      const [metrics, health, dbStatus] = await Promise.all([
        dashboardService.getSystemMetrics(),
        dashboardService.getSystemHealth(),
        dashboardService.getDbStatus(),
      ]);
      return {
        metrics: metrics.data || metrics,
        health: health.data || health,
        dbStatus: dbStatus.data || dbStatus,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch system data");
    }
  }
);

export default dashboardSlice.reducer;
