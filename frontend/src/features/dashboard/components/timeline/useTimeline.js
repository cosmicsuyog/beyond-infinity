import { useState, useEffect, useCallback } from "react";
import timelineService from "../../service/timeline.service";

export function useTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    incidentId: "",
  });

  const fetchTimeline = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Clean up empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      
      const response = await timelineService.getTimeline(activeFilters);
      // Backend returns either an array directly or inside a data object
      const data = response.data || response;
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch timeline events");
      console.error("Error fetching timeline:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const createEvent = async (eventData) => {
    try {
      const response = await timelineService.addTimelineEvent(eventData);
      // Refresh list after creation
      await fetchTimeline();
      return { success: true, data: response.data || response };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create event" };
    }
  };

  const deleteEvent = async (id) => {
    try {
      await timelineService.deleteTimelineEvent(id);
      // Update local state optimistically
      setEvents(prev => prev.filter(evt => evt._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete event" };
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    events,
    loading,
    error,
    filters,
    updateFilters,
    refresh: fetchTimeline,
    createEvent,
    deleteEvent
  };
}
