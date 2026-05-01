/**
 * Service Health Model & Routes
 * Tracks health status of client services
 */

import mongoose from "mongoose";
import { SERVICE_HEALTH_STATUS } from "../../constants/incident.constants.js";

const healthSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    service: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(SERVICE_HEALTH_STATUS),
      default: SERVICE_HEALTH_STATUS.UNKNOWN,
    },

    // Health metrics
    metrics: {
      uptime: Number, // percentage
      responseTime: Number, // ms
      errorRate: Number, // percentage
      cpu: Number,
      memory: Number,
    },

    // Last reported
    lastReportedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Additional details
    message: String,
    details: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

healthSchema.index({ organizationId: 1, service: 1 });

export default mongoose.model("Health", healthSchema);
