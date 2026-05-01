class OrganizationService {
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
      console.error("Organization service error:", error);
      throw error;
    }
  }

  // Get organization details
  async getOrganization(orgId) {
    return this.request(`/api/organizations/${orgId}`, {
      method: "GET",
    });
  }

  // Update organization details
  async updateOrganization(orgId, orgData) {
    return this.request(`/api/organizations/${orgId}`, {
      method: "PUT",
      body: JSON.stringify(orgData),
    });
  }
}

export const organizationService = new OrganizationService();
export default organizationService;
