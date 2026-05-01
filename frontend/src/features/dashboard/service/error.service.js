class ErrorService {
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
      console.error("Error service error:", error);
      throw error;
    }
  }

  // Get error list with filters
  async getErrors(filters = {}) {
    const params = new URLSearchParams();
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.skip) params.append("skip", filters.skip);
    if (filters.hours) params.append("hours", filters.hours);
    if (filters.severity) params.append("severity", filters.severity);
    if (filters.service) params.append("service", filters.service);

    return this.request(`/api/errors?${params.toString()}`, {
      method: "GET",
    });
  }

  // Get single error
  async getError(id) {
    return this.request(`/api/errors/${id}`, {
      method: "GET",
    });
  }

  // Get error statistics
  async getErrorStats() {
    return this.request("/api/errors/stats", {
      method: "GET",
    });
  }

  // Get errors by service
  async getErrorsByService(service) {
    return this.request(`/api/errors/service/${service}`, {
      method: "GET",
    });
  }

  // Update error status
  async updateErrorStatus(id, status) {
    return this.request(`/api/errors/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Link error to incident
  async linkErrorToIncident(errorId, incidentId) {
    return this.request(`/api/errors/${errorId}/link-incident`, {
      method: "POST",
      body: JSON.stringify({ incidentId }),
    });
  }
}

export const errorService = new ErrorService();
export default errorService;
