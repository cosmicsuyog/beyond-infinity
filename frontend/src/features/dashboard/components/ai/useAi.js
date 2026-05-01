import { useState } from "react";
import aiService from "../../service/ai.service";

export function useAi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSummary = async (incidentId, details) => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.generateSummary(incidentId, details);
      return { success: true, data: response.data || response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getTags = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.extractTags(text);
      return { success: true, data: response.data || response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getRootCause = async (incidentId, context) => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.suggestRootCause(incidentId, context);
      return { success: true, data: response.data || response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getSummary,
    getTags,
    getRootCause
  };
}
