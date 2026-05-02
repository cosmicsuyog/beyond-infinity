import { useState, useEffect, useCallback } from "react";
import alertService from "../../service/alert.service";

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    service: "",
    processed: "",
    limit: 50
  });

  const fetchAlerts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      const response = await alertService.getRecentAlerts(activeFilters);
      const data = response.data || response;
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch alerts");
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAlerts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAlerts]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    alerts,
    loading,
    error,
    filters,
    updateFilters,
    refresh: fetchAlerts
  };
}
