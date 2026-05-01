class TimelineService {
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
      console.error("Timeline service error:", error);
      throw error;
    }
  }

  // Get timeline events for an incident
  async getTimeline(filters = {}) {
    const params = new URLSearchParams();
    if (filters.incidentId) params.append("incidentId", filters.incidentId);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.skip) params.append("skip", filters.skip);
    if (filters.type) params.append("type", filters.type);

    return this.request(`/api/timeline?${params.toString()}`, {
      method: "GET",
    });
  }

  // Get timeline by incident ID
  async getIncidentTimeline(incidentId, limit = 50) {
    return this.request(
      `/api/timeline?incidentId=${incidentId}&limit=${limit}`,
      {
        method: "GET",
      }
    );
  }

  // Add timeline event
  async addTimelineEvent(eventData) {
    return this.request("/api/timeline", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }

  // Update timeline event
  async updateTimelineEvent(id, updateData) {
    return this.request(`/api/timeline/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  // Delete timeline event
  async deleteTimelineEvent(id) {
    return this.request(`/api/timeline/${id}`, {
      method: "DELETE",
    });
  }

  // Get all events for a service
  async getServiceTimeline(service, limit = 100) {
    return this.request(`/api/timeline/service/${service}?limit=${limit}`, {
      method: "GET",
    });
  }
}

export const timelineService = new TimelineService();
export default timelineService;
