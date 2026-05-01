/**
 * Socket Integration
 * Emits real-time events from incident operations
 */

import {
  emitIncidentCreated,
  emitIncidentUpdated,
  emitIncidentStatusChanged,
  emitIncidentAssigned,
} from "../../sockets/server.socket.js";

/**
 * Emit incident creation to all org users
 */
export const socketEmitIncidentCreated = (organizationId, incident) => {
  try {
    emitIncidentCreated(organizationId, incident);
  } catch (err) {
    console.warn("⚠️ Socket emit incident created failed:", err.message);
  }
};

/**
 * Emit incident update
 */
export const socketEmitIncidentUpdated = (organizationId, incident) => {
  try {
    emitIncidentUpdated(organizationId, incident);
  } catch (err) {
    console.warn("⚠️ Socket emit incident updated failed:", err.message);
  }
};

/**
 * Emit status change
 */
export const socketEmitStatusChanged = (organizationId, incidentId, newStatus) => {
  try {
    emitIncidentStatusChanged(organizationId, incidentId, newStatus);
  } catch (err) {
    console.warn("⚠️ Socket emit status changed failed:", err.message);
  }
};

/**
 * Emit assignment
 */
export const socketEmitAssigned = (organizationId, incidentId, users) => {
  try {
    emitIncidentAssigned(organizationId, incidentId, users);
  } catch (err) {
    console.warn("⚠️ Socket emit assigned failed:", err.message);
  }
};

export default {
  socketEmitIncidentCreated,
  socketEmitIncidentUpdated,
  socketEmitStatusChanged,
  socketEmitAssigned,
};
