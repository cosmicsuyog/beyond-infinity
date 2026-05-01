import { useState, useEffect, useCallback } from "react";
import healthService from "../../service/health.service";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthService.getAllHealth();
      const data = response.data || response;
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch services health");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const getHealthHistory = async (serviceName, hours = 24) => {
    try {
      const response = await healthService.getHealthHistory(serviceName, hours);
      return { success: true, data: response.data || response };
    } catch (err) {
      return { success: false, error: err.message || "Failed to fetch health history" };
    }
  };

  return {
    services,
    loading,
    error,
    refresh: fetchServices,
    getHealthHistory
  };
}
