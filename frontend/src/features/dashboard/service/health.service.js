class HealthService {
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
      console.error("Health service error:", error);
      throw error;
    }
  }

  // Get all services health
  async getAllHealth() {
    return this.request("/api/health", {
      method: "GET",
    });
  }

  // Get single service health
  async getServiceHealth(serviceName) {
    return this.request(`/api/health/${serviceName}`, {
      method: "GET",
    });
  }

  // Get health history for a service
  async getHealthHistory(serviceName, hours = 24) {
    return this.request(`/api/health/${serviceName}/history?hours=${hours}`, {
      method: "GET",
    });
  }

  // Get health metrics
  async getHealthMetrics() {
    return this.request("/api/health/metrics", {
      method: "GET",
    });
  }

  // Get health status overview
  async getHealthOverview() {
    return this.request("/api/health/overview", {
      method: "GET",
    });
  }

  // Update service health status
  async updateHealthStatus(serviceName, statusData) {
    return this.request(`/api/health/${serviceName}`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    });
  }

  // Get system-wide metrics (CPU, Memory, etc.)
  async getSystemMetrics() {
    return this.request("/api/system/metrics", {
      method: "GET",
    });
  }

  // Get overall system health
  async getSystemHealth() {
    return this.request("/api/system/health", {
      method: "GET",
    });
  }

  // Get database connection status and metrics
  async getDbStatus() {
    return this.request("/api/system/db-status", {
      method: "GET",
    });
  }
}

export const healthService = new HealthService();
export default healthService;
