import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    // 🔹 Organization & Service
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    // 🔹 Fingerprint (for linking errors to incident)
    fingerprint: {
      type: String,
      index: true,
    },

    // 🔹 Basic Info
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 🔹 Classification
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["open", "investigating", "identified", "resolved"],
      default: "open",
      index: true,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
      },
    ],

    // 🔹 Ownership
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🔹 AI Data (stored for speed & history)
    aiAnalysis: {
      summary: String,
      possibleCauses: [String],
      confidence: Number,
      analyzedAt: Date,
    },

    // 🔹 Metrics Snapshot (VERY IMPORTANT)
    metricsAtTime: {
      cpu: Number,
      memory: Number,
      dbResponseTime: Number,
      errorRate: Number,
    },

    // 🔹 Source (where incident came from)
    source: {
      type: String,
      enum: ["manual", "api", "monitoring", "ai"],
      default: "api",
    },

    externalId: {
      type: String, // client system ID
    },

    // 🔹 Error Aggregation Info
    errorCount: {
      type: Number,
      default: 1,
    },

    // 🔹 Lifecycle Tracking
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    acknowledgedAt: Date,
    resolvedAt: Date,

    resolutionTime: Number, // ms
  },
  {
    timestamps: true,
  }
);

// Compound index for fast organization+service lookup
incidentSchema.index({ organizationId: 1, service: 1, startedAt: -1 });

// Fingerprint + organization for linking errors
incidentSchema.index({ organizationId: 1, fingerprint: 1 });

const incident = mongoose.model("incident", incidentSchema);
export default incident;
