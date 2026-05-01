class DashboardService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Dashboard service error:", error);
      throw error;
    }
  }

  /* ─── DASHBOARD ANALYTICS ─── */

  // Get aggregate dashboard stats (Total incidents, resolved, critical, etc.)
  async getDashboardStats() {
    return this.request("/api/dashboard/stats", {
      method: "GET",
    });
  }

  // Get incident trends over time for the main chart
  async getIncidentTrends(days = 7) {
    return this.request(`/api/dashboard/trends?days=${days}`, {
      method: "GET",
    });
  }

  /* ─── INCIDENT MANAGEMENT ─── */

  async getIncidents(filters = {}) {
    const params = new URLSearchParams();
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.skip) params.append("skip", filters.skip);
    if (filters.status) params.append("status", filters.status);
    if (filters.severity) params.append("severity", filters.severity);
    if (filters.service) params.append("service", filters.service);
    if (filters.tags) params.append("tags", filters.tags);

    return this.request(`/api/incidents?${params.toString()}`, {
      method: "GET",
    });
  }

  async getIncident(id) {
    return this.request(`/api/incidents/${id}`, {
      method: "GET",
    });
  }

  async createIncident(incidentData) {
    return this.request("/api/incidents", {
      method: "POST",
      body: JSON.stringify(incidentData),
    });
  }

  async updateIncidentStatus(id, status) {
    return this.request(`/api/incidents/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async assignIncident(id, autoAssign = true, userIds = []) {
    return this.request(`/api/incidents/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ autoAssign, userIds }),
    });
  }

  /* ─── SYSTEM HEALTH ─── */

  async getAllHealth() {
    return this.request("/api/health", {
      method: "GET",
    });
  }

  async getServiceHealth(service) {
    return this.request(`/api/health/${service}`, {
      method: "GET",
    });
  }

  /* ─── SYSTEM CORE ─── */

  async getSystemMetrics() {
    return this.request("/api/system/metrics", {
      method: "GET",
    });
  }

  async getSystemHealth() {
    return this.request("/api/system/health", {
      method: "GET",
    });
  }

  async getDbStatus() {
    return this.request("/api/system/db-status", {
      method: "GET",
    });
  }

  /* ─── ERROR & TIMELINE ─── */

  async getErrorList(filters = {}) {
    const params = new URLSearchParams();
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.skip) params.append("skip", filters.skip);
    if (filters.hours) params.append("hours", filters.hours);

    return this.request(`/api/errors?${params.toString()}`, {
      method: "GET",
    });
  }

  async getErrorStats() {
    return this.request("/api/errors/stats", {
      method: "GET",
    });
  }

  async getTimeline(filters = {}) {
    const params = new URLSearchParams();
    if (filters.incidentId) params.append("incidentId", filters.incidentId);
    if (filters.limit) params.append("limit", filters.limit);

    return this.request(`/api/timeline?${params.toString()}`, {
      method: "GET",
    });
  }

  async addTimelineEvent(eventData) {
    return this.request("/api/timeline", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
