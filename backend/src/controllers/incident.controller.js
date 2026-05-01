/**
 * Incident Controller
 * Handles incident CRUD, status updates, assignments
 * Integrates with assignment engine for responder selection
 */

import { validationResult } from "express-validator";
import {
  createIncident,
  getIncidentById,
  listIncidents,
  updateIncidentStatus,
  assignIncidentToUsers,
  getIncidentStats,
} from "../../services/incident/incident.service.js";
import {
  scoreAndAssignResponder,
  getAvailableResponders,
} from "../../services/assignment/assignment.service.js";
import {
  socketEmitIncidentCreated,
  socketEmitStatusChanged,
  socketEmitAssigned,
} from "../../services/socket/socket.integration.js";
import UserModel from "../../models/user.model.js";

/**
 * POST /api/incidents
 * Create new incident (manual creation - not from error aggregation)
 */
export const createIncidentManual = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.user?.organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { title, description, service, severity, tags = [] } = req.body;

    // Create incident (without AI analysis in this case - manual entry)
    const incident = await createIncident({
      organizationId: req.user.organizationId,
      service,
      fingerprint: null, // No fingerprint for manual incidents
      errorDescription: description,
      errorCount: 1,
      suggestedSeverity: severity,
    });

    // Update with manual fields
    incident.title = title;
    incident.createdBy = req.user._id;
    incident.tags = tags;
    incident.source = "manual";
    await incident.save();

    // Emit socket event
    socketEmitIncidentCreated(req.user.organizationId, incident);

    return res.status(201).json({
      success: true,
      message: "Incident created successfully",
      data: incident,
    });
  } catch (err) {
    console.error("❌ Create Incident Manual Error:", err.message);
    next(err);
  }
};

/**
 * GET /api/incidents/:id
 * Get single incident with full details
 */
export const getIncident = async (req, res, next) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const incident = await getIncidentById(req.params.id, req.user.organizationId);

    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (err) {
    if (err.message === "Incident not found") {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }
    console.error("❌ Get Incident Error:", err.message);
    next(err);
  }
};

/**
 * GET /api/incidents
 * List incidents with filters and pagination
 */
export const listIncidentsHandler = async (req, res, next) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { limit = 50, skip = 0, status, severity, service, tags, startDate, endDate } = req.query;

    const result = await listIncidents(req.user.organizationId, {
      limit: Math.min(parseInt(limit) || 50, 500),
      skip: Math.max(0, parseInt(skip) || 0),
      status,
      severity,
      service,
      tags: typeof tags === "string" ? tags.split(",") : tags,
      startDate,
      endDate,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("❌ List Incidents Error:", err.message);
    next(err);
  }
};

/**
 * PUT /api/incidents/:id/status
 * Update incident status
 */
export const updateIncidentStatusHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.user?.organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { status } = req.body;

    const updated = await updateIncidentStatus(req.params.id, req.user.organizationId, status);

    // Emit socket event
    socketEmitStatusChanged(req.user.organizationId, req.params.id, status);

    return res.status(200).json({
      success: true,
      message: `Incident status updated to ${status}`,
      data: updated,
    });
  } catch (err) {
    if (err.message.includes("Invalid status")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error("❌ Update Incident Status Error:", err.message);
    next(err);
  }
};

/**
 * POST /api/incidents/:id/assign
 * Assign incident to responders with auto-scoring
 *
 * Body: {
 *   autoAssign: true,  // Use scoring algorithm
 *   userIds: [...] (optional - manual assignment)
 * }
 */
export const assignIncident = async (req, res, next) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { autoAssign = false, userIds } = req.body;

    // Fetch incident
    const incident = await getIncidentById(req.params.id, req.user.organizationId);

    let finalUserIds = userIds;

    // ===== AUTO-ASSIGN: Use scoring algorithm =====
    if (autoAssign) {
      // Get available responders in organization
      const responders = await UserModel.find({
        organizationId: req.user.organizationId,
        role: { $in: ["responder", "admin"] },
        isActive: { $ne: false },
      }).lean();

      if (responders.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No available responders for assignment",
        });
      }

      const availableResponders = getAvailableResponders(responders);

      // Score and assign
      const assignmentResult = await scoreAndAssignResponder({
        responders: availableResponders,
        incidentTags: incident.tags || [],
      });

      if (!assignmentResult.selectedResponder) {
        return res.status(400).json({
          success: false,
          message: "Could not find suitable responder",
          scores: assignmentResult.scores,
        });
      }

      finalUserIds = [assignmentResult.selectedResponder._id];

      // Emit socket event
      socketEmitAssigned(req.user.organizationId, incident._id, finalUserIds);

      return res.status(200).json({
        success: true,
        message: assignmentResult.recommendation,
        data: {
          incident: incident._id,
          assignedTo: finalUserIds,
          scores: assignmentResult.scores,
        },
      });
    }

    // ===== MANUAL ASSIGNMENT =====
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "userIds required for manual assignment",
      });
    }

    const updated = await assignIncidentToUsers(req.params.id, req.user.organizationId, userIds);

    // Emit socket event
    socketEmitAssigned(req.user.organizationId, req.params.id, userIds);

    return res.status(200).json({
      success: true,
      message: "Incident assigned successfully",
      data: updated,
    });
  } catch (err) {
    if (err.message === "Incident not found") {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }
    console.error("❌ Assign Incident Error:", err.message);
    next(err);
  }
};

/**
 * GET /api/incidents/dashboard/stats
 * Get incident statistics for dashboard
 */
export const getIncidentDashboardStats = async (req, res, next) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const stats = await getIncidentStats(req.user.organizationId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("❌ Get Dashboard Stats Error:", err.message);
    next(err);
  }
};

export default {
  createIncidentManual,
  getIncident,
  listIncidentsHandler,
  updateIncidentStatusHandler,
  assignIncident,
  getIncidentDashboardStats,
};
