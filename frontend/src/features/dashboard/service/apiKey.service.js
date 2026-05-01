class ApiKeyService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
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
      console.error('API Key service error:', error);
      throw error;
    }
  }

  // Create new API key
  async createApiKey(name, permissions = 'full') {
    return this.request('/api/keys', {
      method: 'POST',
      body: JSON.stringify({ name, permissions }),
    });
  }

  // Get all API keys for current user
  async getAllApiKeys() {
    return this.request('/api/keys', {
      method: 'GET',
    });
  }

  // Revoke API key by ID
  async revokeApiKey(keyId) {
    return this.request(`/api/keys/${keyId}`, {
      method: 'DELETE',
    });
  }
}

export const apiKeyService = new ApiKeyService();
export default apiKeyService;
