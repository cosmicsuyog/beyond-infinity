class NotificationService {
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
      console.error("Notification service error:", error);
      throw error;
    }
  }

  // Get user notifications
  async getNotifications() {
    return this.request("/api/notifications", {
      method: "GET",
    });
  }

  // Mark notification as read
  async markAsRead(id) {
    return this.request(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
