class UserService {
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
      console.error("User service error:", error);
      throw error;
    }
  }

  // Update user profile (Current User)
  async updateProfile(profileData) {
    return this.request("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Admin: Get all users
  async getUsers() {
    return this.request("/api/users", {
      method: "GET",
    });
  }

  // Admin: Get single user
  async getUser(id) {
    return this.request(`/api/users/${id}`, {
      method: "GET",
    });
  }

  // Admin: Update user role/status
  async updateUser(id, userData) {
    return this.request(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  // Admin: Deactivate/Delete user
  async deleteUser(id) {
    return this.request(`/api/users/${id}`, {
      method: "DELETE",
    });
  }
}

export const userService = new UserService();
export default userService;
