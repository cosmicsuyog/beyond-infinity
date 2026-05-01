class AlertService {
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
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Alert service error:", error);
      throw error;
    }
  }

  // Get recent alerts (errors)
  async getRecentAlerts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/errors/recent?${query}`, {
      method: "GET",
    });
  }

  // Get alert details
  async getAlertById(alertId) {
    return this.request(`/api/errors/${alertId}`, {
      method: "GET",
    });
  }

  // Intake a new alert (client-side simulation or for testing)
  async intakeAlert(alertData) {
    // Note: This usually requires an API key, so this is mainly for simulation
    // or if the frontend has an API key for internal logging.
    return this.request("/api/errors/intake", {
      method: "POST",
      body: JSON.stringify(alertData),
    });
  }
}

export const alertService = new AlertService();
export default alertService;
