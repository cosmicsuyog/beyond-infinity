/**
 * Timeline Model - Full Audit Trail
 * Tracks every change to incidents for compliance and debugging
 */

import mongoose from "mongoose";
import { TIMELINE_EVENT_TYPES } from "../../constants/incident.constants.js";

const timelineSchema = new mongoose.Schema(
  {
    // Which incident
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
      index: true,
    },

    // Organization for filtering
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // What happened
    eventType: {
      type: String,
      enum: Object.values(TIMELINE_EVENT_TYPES),
      required: true,
      index: true,
    },

    // Who did it
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // What changed
    changes: {
      from: mongoose.Schema.Types.Mixed, // Old value
      to: mongoose.Schema.Types.Mixed, // New value
      field: String, // Which field changed
    },

    // Metadata for context
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Description for readability
    description: String,
  },
  {
    timestamps: true, // createdAt for timeline ordering
  }
);

// Index for efficient querying
timelineSchema.index({ incidentId: 1, createdAt: -1 });
timelineSchema.index({ organizationId: 1, createdAt: -1 });

export default mongoose.model("Timeline", timelineSchema);
