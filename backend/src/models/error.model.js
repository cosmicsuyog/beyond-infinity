import mongoose from "mongoose";
import { ERROR_SOURCES, ERROR_RETENTION_DAYS } from "../../constants/incident.constants.js";

/**
 * Error Schema - Stores raw errors from client systems
 * Errors are grouped by fingerprint into incidents
 * Stored for audit trail and historical analysis
 */
const errorSchema = new mongoose.Schema(
  {
    // Organization that reported the error
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // Service/application that generated the error
    service: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    // Error message/description
    error: {
      type: String,
      required: true,
      trim: true,
    },

    // HTTP status code (if applicable)
    statusCode: {
      type: Number,
      min: 100,
      max: 599,
    },

    // Stack trace or detailed error info
    stackTrace: {
      type: String,
      default: null,
    },

    // Deterministic fingerprint for grouping
    // SHA256 hash of (organizationId + service + error message)
    fingerprint: {
      type: String,
      required: true,
      index: true,
    },

    // API key used to report error (for audit)
    apiKeyId: {
      type: String,
      default: null,
      index: true,
    },

    // Link to incident if grouped
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      default: null,
      index: true,
    },

    // Error source
    source: {
      type: String,
      enum: Object.values(ERROR_SOURCES),
      default: ERROR_SOURCES.API,
    },

    // Metadata from client
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Whether error has been reviewed/processed
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },

    // When error occurred (from client)
    errorTimestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/**
 * Indexes for efficient querying
 */
errorSchema.index({ organizationId: 1, fingerprint: 1 }); // Fast fingerprint lookup
errorSchema.index({ organizationId: 1, service: 1, errorTimestamp: -1 }); // Service errors by time
errorSchema.index({ incidentId: 1 }); // Find errors by incident
errorSchema.index({ createdAt: 1 }, { expireAfterSeconds: ERROR_RETENTION_DAYS * 86400 }); // Auto-delete after retention period

export default mongoose.model("Error", errorSchema);
