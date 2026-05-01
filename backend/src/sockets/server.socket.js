import { Server } from "socket.io";
import { ENV } from "../config/env.config.js";

let io;

/**
 * Initialize Socket.IO Server with JWT authentication
 */
export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    },
    pingTimeout: 60000,
  });

  console.log("🚀 Socket.IO server initialized");

  /**
   * Global connection handler
   */
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    /**
     * Join organization room for incident updates
     * Usage: socket.emit('join_org', { organizationId })
     */
    socket.on("join_org", ({ organizationId }) => {
      if (!organizationId) {
        socket.emit("error", "organizationId required");
        return;
      }

      const roomId = `org:${organizationId}`;
      socket.join(roomId);
      console.log(`📥 Socket ${socket.id} joined organization ${organizationId}`);
    });

    /**
     * Leave organization room
     */
    socket.on("leave_org", ({ organizationId }) => {
      if (!organizationId) return;
      const roomId = `org:${organizationId}`;
      socket.leave(roomId);
      console.log(`📤 Socket ${socket.id} left organization ${organizationId}`);
    });

    /**
     * Disconnect event
     */
    socket.on("disconnect", (reason) => {
      console.log(`❌ User disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

/**
 * Emit incident created event
 */
export const emitIncidentCreated = (organizationId, incidentData) => {
  if (!io) return;
  const roomId = `org:${organizationId}`;
  io.to(roomId).emit("incident:created", {
    incident: incidentData,
    timestamp: new Date(),
  });
};

/**
 * Emit incident updated event
 */
export const emitIncidentUpdated = (organizationId, incidentData) => {
  if (!io) return;
  const roomId = `org:${organizationId}`;
  io.to(roomId).emit("incident:updated", {
    incident: incidentData,
    timestamp: new Date(),
  });
};

/**
 * Emit incident status changed
 */
export const emitIncidentStatusChanged = (organizationId, incidentId, newStatus) => {
  if (!io) return;
  const roomId = `org:${organizationId}`;
  io.to(roomId).emit("incident:status_changed", {
    incidentId,
    status: newStatus,
    timestamp: new Date(),
  });
};

/**
 * Emit incident assigned
 */
export const emitIncidentAssigned = (organizationId, incidentId, assignedUsers) => {
  if (!io) return;
  const roomId = `org:${organizationId}`;
  io.to(roomId).emit("incident:assigned", {
    incidentId,
    assignedTo: assignedUsers,
    timestamp: new Date(),
  });
};

/**
 * Emit error aggregated
 */
export const emitErrorAggregated = (organizationId, aggregationData) => {
  if (!io) return;
  const roomId = `org:${organizationId}`;
  io.to(roomId).emit("error:aggregated", {
    ...aggregationData,
    timestamp: new Date(),
  });
};

/**
 * Emit error group threshold reached
 */
export const emitThresholdReached = (organizationId, groupData) => {
  if (!io) return;
  const roomId = `org:${organizationId}`;
  io.to(roomId).emit("alert:threshold_reached", {
    ...groupData,
    timestamp: new Date(),
  });
};

/**
 * Get Socket.IO instance
 */
export const getIO = () => io;

export default {
  initSocketServer,
  emitIncidentCreated,
  emitIncidentUpdated,
  emitIncidentStatusChanged,
  emitIncidentAssigned,
  emitErrorAggregated,
  emitThresholdReached,
  getIO,
};
