/**
 * Timeline Service - Event Logging
 * Records all incident changes for audit trail
 */

import TimelineModel from "../../models/timeline.model.js";

/**
 * Log an event to timeline
 * @param {object} params
 * @param {string} params.incidentId - Incident ID
 * @param {string} params.organizationId - Organization ID
 * @param {string} params.eventType - Type of event (from TIMELINE_EVENT_TYPES)
 * @param {string} params.userId - User who triggered event (optional)
 * @param {object} params.changes - What changed {from, to, field} (optional)
 * @param {object} params.metadata - Additional context (optional)
 * @param {string} params.description - Human-readable description (optional)
 */
export const logTimelineEvent = async ({
  incidentId,
  organizationId,
  eventType,
  userId = null,
  changes = null,
  metadata = null,
  description = null,
}) => {
  try {
    const event = await TimelineModel.create({
      incidentId,
      organizationId,
      eventType,
      userId,
      changes,
      metadata,
      description,
    });

    return event;
  } catch (err) {
    console.error("❌ Log Timeline Event Error:", err.message);
    throw err;
  }
};

/**
 * Get timeline for incident
 * @param {string} incidentId - Incident ID
 * @param {string} organizationId - Organization ID for permission check
 * @returns {Promise<Array>}
 */
export const getIncidentTimeline = async (incidentId, organizationId) => {
  try {
    const events = await TimelineModel.find({
      incidentId,
      organizationId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return events;
  } catch (err) {
    console.error("❌ Get Incident Timeline Error:", err.message);
    throw err;
  }
};

export default {
  logTimelineEvent,
  getIncidentTimeline,
};
