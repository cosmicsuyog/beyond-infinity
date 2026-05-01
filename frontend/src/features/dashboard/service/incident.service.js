class IncidentService {
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
      console.error("Incident service error:", error);
      throw error;
    }
  }

  // Create new incident
  async createIncident(incidentData) {
    return this.request("/api/incidents", {
      method: "POST",
      body: JSON.stringify(incidentData),
    });
  }

  // Get all incidents with filters
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

  // Get single incident
  async getIncident(id) {
    return this.request(`/api/incidents/${id}`, {
      method: "GET",
    });
  }

  // Update incident status
  async updateIncidentStatus(id, status) {
    return this.request(`/api/incidents/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Assign incident to responders
  async assignIncident(id, autoAssign = true, userIds = []) {
    return this.request(`/api/incidents/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ autoAssign, userIds }),
    });
  }

  // Get incident stats for dashboard
  async getIncidentStats() {
    return this.request("/api/incidents/dashboard/stats", {
      method: "GET",
    });
  }
}

export const incidentService = new IncidentService();
export default incidentService;
