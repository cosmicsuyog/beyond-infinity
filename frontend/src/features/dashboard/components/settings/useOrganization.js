import { useState, useEffect, useCallback } from "react";
import organizationService from "../../service/organization.service";
import { useAuth } from "../../../auth/context/AuthContext";

export function useOrganization() {
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const orgId = user?.organizationId || user?.orgId;

  const fetchOrganization = useCallback(async (showLoading = true) => {
    if (!orgId) return;
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const response = await organizationService.getOrganization(orgId);
      setOrganization(response.data || response);
    } catch (err) {
      setError(err.message || "Failed to fetch organization");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrganization(false);
  }, [fetchOrganization]);

  const updateOrg = async (data) => {
    if (!orgId) return;
    setUpdating(true);
    try {
      const response = await organizationService.updateOrganization(orgId, data);
      setOrganization(response.data || response);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setUpdating(false);
    }
  };

  return {
    organization,
    loading,
    error,
    updating,
    refresh: fetchOrganization,
    updateOrg
  };
}
