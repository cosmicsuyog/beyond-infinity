import { useState, useEffect, useCallback } from "react";
import incidentService from "../../service/incident.service";

export function useIncidents(config = { skipFetch: false }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(!config.skipFetch);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    severity: "",
  });

  const fetchIncidents = useCallback(async (showLoading = true) => {
    if (config.skipFetch) return;
    try {
      if (showLoading) setLoading(true);
      setError(null);
      // Clean up empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      
      const response = await incidentService.getIncidents(activeFilters);
      // Backend returns either an array directly or inside a data object
      const data = response.data || response;
      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch incidents");
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, config.skipFetch]);

  useEffect(() => {
    if (!config.skipFetch) {
      fetchIncidents(false);
    }
  }, [fetchIncidents, config.skipFetch]);

  const createIncident = async (incidentData) => {
    try {
      const response = await incidentService.createIncident(incidentData);
      // Refresh list after creation
      await fetchIncidents();
      return { success: true, data: response.data || response };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create incident" };
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await incidentService.updateIncidentStatus(id, status);
      // Update local state optimistically
      setIncidents(prev => 
        prev.map(inc => inc._id === id ? { ...inc, status } : inc)
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to update status" };
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    incidents,
    loading,
    error,
    filters,
    updateFilters,
    refresh: fetchIncidents,
    createIncident,
    updateStatus
  };
}
