class AiService {
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
      console.error("AI service error:", error);
      throw error;
    }
  }

  // Generate summary for an incident
  async generateSummary(incidentId, details) {
    return this.request("/api/ai/summary", {
      method: "POST",
      body: JSON.stringify({ incidentId, details }),
    });
  }

  // Extract tags from incident data
  async extractTags(text) {
    return this.request("/api/ai/tags", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  // Suggest root cause based on logs/metrics
  async suggestRootCause(incidentId, context) {
    return this.request("/api/ai/root-cause", {
      method: "POST",
      body: JSON.stringify({ incidentId, context }),
    });
  }
}

export const aiService = new AiService();
export default aiService;
