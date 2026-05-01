/**
 * Incident Service
 * Handles incident creation, retrieval, status updates
 * Integrates with AI analysis and error aggregation
 */

import IncidentModel from "../../models/incident.model.js";
import { analyzeIncidentOnce } from "../AI/analysis/ai.analysis.service.js";
import { markErrorsProcessed } from "../../services/aggregation/aggregation.service.js";

/**
 * Create incident from aggregated errors
 * Single AI call happens here
 * Links errors to incident
 *
 * @param {object} params
 * @param {string} params.organizationId - Organization ID
 * @param {string} params.service - Service name
 * @param {string} params.fingerprint - Error fingerprint
 * @param {string} params.errorDescription - Error message for AI analysis
 * @param {number} params.errorCount - Count of aggregated errors
 * @param {string} params.suggestedSeverity - Severity from aggregation
 * @returns {Promise<object>} Created incident document
 *
 * @example
 * const incident = await createIncident({
 *   organizationId: "org123",
 *   service: "payment-service",
 *   fingerprint: "abc123",
 *   errorDescription: "Payment timeout",
 *   errorCount: 15,
 *   suggestedSeverity: "high"
 * });
 */
export const createIncident = async ({
  organizationId,
  service,
  fingerprint,
  errorDescription,
  errorCount,
  suggestedSeverity,
}) => {
  try {
    // ===== AI Analysis (Single Call) =====
    const aiAnalysis = await analyzeIncidentOnce({
      description: errorDescription,
    });

    // ===== Use AI results or defaults =====
    const title = aiAnalysis.summary || `${service} - ${errorDescription.substring(0, 100)}`;
    const severity = aiAnalysis.severity || suggestedSeverity || "medium";
    const tags = aiAnalysis.tags || [];
    const possibleCauses = aiAnalysis.possibleCauses || [];

    // ===== Create Incident =====
    const incident = await IncidentModel.create({
      organizationId,
      service: service.toLowerCase().trim(),
      fingerprint,
      title,
      description: errorDescription,
      severity,
      status: "open",
      tags,
      source: "api",
      aiAnalysis: {
        summary: aiAnalysis.summary,
        possibleCauses,
        confidence: aiAnalysis.confidence,
        analyzedAt: new Date(),
      },
      errorCount,
      startedAt: new Date(),
    });

    // ===== Link Errors to Incident =====
    await markErrorsProcessed(organizationId, fingerprint, incident._id);

    console.log("✅ Incident created:", incident._id);

    return incident;
  } catch (err) {
    console.error("❌ Create Incident Error:", err.message);
    throw err;
  }
};

/**
 * Get incident by ID with full details
 * @param {string} incidentId - Incident ID
 * @param {string} organizationId - Organization for permission check
 */
export const getIncidentById = async (incidentId, organizationId) => {
  try {
    const incident = await IncidentModel.findOne({
      _id: incidentId,
      organizationId,
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email skills");

    if (!incident) {
      throw new Error("Incident not found");
    }

    return incident;
  } catch (err) {
    console.error("❌ Get Incident By ID Error:", err.message);
    throw err;
  }
};

/**
 * List incidents for organization with filters
 * @param {string} organizationId - Organization ID
 * @param {object} options - Filter options
 */
export const listIncidents = async (
  organizationId,
  { limit = 50, skip = 0, status, severity, service, tags, startDate, endDate } = {}
) => {
  try {
    // Build query
    const query = { organizationId };

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (service) query.service = service.toLowerCase().trim();

    if (tags && Array.isArray(tags) && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (startDate || endDate) {
      query.startedAt = {};
      if (startDate) query.startedAt.$gte = new Date(startDate);
      if (endDate) query.startedAt.$lte = new Date(endDate);
    }

    // Execute query
    const total = await IncidentModel.countDocuments(query);
    const incidents = await IncidentModel.find(query)
      .select("title service severity status tags errorCount startedAt resolvedAt")
      .sort({ startedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return {
      total,
      limit,
      skip,
      count: incidents.length,
      incidents,
    };
  } catch (err) {
    console.error("❌ List Incidents Error:", err.message);
    throw err;
  }
};

/**
 * Update incident status
 * @param {string} incidentId - Incident ID
 * @param {string} organizationId - Organization for permission check
 * @param {string} newStatus - New status (open, investigating, identified, resolved)
 */
export const updateIncidentStatus = async (incidentId, organizationId, newStatus) => {
  try {
    const validStatuses = ["open", "investigating", "identified", "resolved"];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const updateData = { status: newStatus };

    // If resolved, calculate resolution time
    if (newStatus === "resolved") {
      updateData.resolvedAt = new Date();

      const incident = await IncidentModel.findOne({
        _id: incidentId,
        organizationId,
      });

      if (incident?.startedAt) {
        updateData.resolutionTime = new Date() - incident.startedAt;
      }
    }

    const updated = await IncidentModel.findOneAndUpdate(
      { _id: incidentId, organizationId },
      updateData,
      { new: true }
    );

    if (!updated) {
      throw new Error("Incident not found");
    }

    return updated;
  } catch (err) {
    console.error("❌ Update Incident Status Error:", err.message);
    throw err;
  }
};

/**
 * Assign incident to users
 * @param {string} incidentId - Incident ID
 * @param {string} organizationId - Organization for permission check
 * @param {Array} userIds - User IDs to assign
 */
export const assignIncidentToUsers = async (incidentId, organizationId, userIds) => {
  try {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new Error("userIds must be a non-empty array");
    }

    const updated = await IncidentModel.findOneAndUpdate(
      { _id: incidentId, organizationId },
      { assignedTo: userIds },
      { new: true }
    );

    if (!updated) {
      throw new Error("Incident not found");
    }

    return updated;
  } catch (err) {
    console.error("❌ Assign Incident Error:", err.message);
    throw err;
  }
};

/**
 * Get incident statistics for dashboard
 * @param {string} organizationId - Organization ID
 */
export const getIncidentStats = async (organizationId) => {
  try {
    const total = await IncidentModel.countDocuments({ organizationId });

    const open = await IncidentModel.countDocuments({
      organizationId,
      status: { $ne: "resolved" },
    });

    const critical = await IncidentModel.countDocuments({
      organizationId,
      severity: "critical",
      status: { $ne: "resolved" },
    });

    const byService = await IncidentModel.aggregate([
      { $match: { organizationId } },
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const bySeverity = await IncidentModel.aggregate([
      { $match: { organizationId } },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);

    return {
      total,
      open,
      critical,
      byService,
      bySeverity,
    };
  } catch (err) {
    console.error("❌ Get Incident Stats Error:", err.message);
    throw err;
  }
};

export default {
  createIncident,
  getIncidentById,
  listIncidents,
  updateIncidentStatus,
  assignIncidentToUsers,
  getIncidentStats,
};
