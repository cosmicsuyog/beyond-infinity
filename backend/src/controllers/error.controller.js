import { validationResult } from "express-validator";
import ErrorModel from "../../models/error.model.js";
import { generateErrorFingerprint } from "../../utils/aggregation/errorFingerprint.js";
import { aggregateError } from "../../services/aggregation/aggregation.service.js";

/**
 * Error Intake Controller
 * Receives errors from client systems via API key
 * Stores error and triggers aggregation logic
 */

/**
 * POST /api/errors/intake
 * Receive error from client system
 *
 * @param {object} req - Express request
 * @param {string} req.headers['x-api-key'] - API key (validated by middleware)
 * @param {string} req.body.service - Service name
 * @param {string} req.body.error - Error description
 * @param {number} req.body.statusCode - HTTP status code (optional)
 * @param {string} req.body.stackTrace - Stack trace (optional)
 * @param {object} req.body.metadata - Additional metadata (optional)
 * @param {string} req.body.timestamp - When error occurred (optional, uses now if not provided)
 * @param {object} res - Express response
 */
export const intakeError = async (req, res, next) => {
  try {
    // ===== Input Validation =====
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { service, error, statusCode, stackTrace, metadata, timestamp } = req.body;

    // ===== Get Organization from API Key =====
    // API key middleware attaches apiKeyData to request
    if (!req.apiKeyData?.organizationId) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key or organization",
      });
    }

    const organizationId = req.apiKeyData.organizationId;
    const keyId = req.apiKeyData.keyId;

    // ===== Calculate Error Fingerprint =====
    const fingerprint = generateErrorFingerprint(organizationId, service, error);

    // ===== Create Error Record =====
    const errorRecord = await ErrorModel.create({
      organizationId,
      service: service.toLowerCase().trim(),
      error: error.trim(),
      statusCode,
      stackTrace: stackTrace || null,
      fingerprint,
      apiKeyId: keyId,
      source: "api",
      metadata: metadata || null,
      errorTimestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    // ===== Process Through Aggregation Engine =====
    // Check if error group threshold has been reached
    const aggregationResult = await aggregateError({
      organizationId,
      service: service.toLowerCase().trim(),
      error: error.trim(),
      fingerprint,
    });

    // ===== Response =====
    return res.status(201).json({
      success: true,
      message: "Error received and queued for processing",
      data: {
        errorId: errorRecord._id,
        fingerprint: errorRecord.fingerprint,
        service: errorRecord.service,
        aggregation: {
          groupCount: aggregationResult.groupCount,
          shouldCreateIncident: aggregationResult.shouldCreate,
          suggestedSeverity: aggregationResult.severity,
        },
      },
    });
  } catch (err) {
    console.error("❌ Error Intake Error:", err.message);
    next(err);
  }
};

/**
 * GET /api/errors/recent
 * Get recent errors for organization (admin/responder only)
 *
 * @param {object} req - Express request with authenticated user
 * @param {number} req.query.limit - Limit results (default: 50, max: 500)
 * @param {number} req.query.skip - Skip results for pagination (default: 0)
 * @param {string} req.query.service - Filter by service (optional)
 * @param {boolean} req.query.processed - Filter by processed status (optional)
 */
export const getRecentErrors = async (req, res, next) => {
  try {
    // User must be authenticated
    if (!req.user?.organizationId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { limit = 50, skip = 0, service, processed } = req.query;

    // Validate and constrain limit
    const normalizedLimit = Math.min(Math.max(1, parseInt(limit) || 50), 500);
    const normalizedSkip = Math.max(0, parseInt(skip) || 0);

    // Build query filter
    const query = { organizationId: req.user.organizationId };
    if (service) query.service = service.toLowerCase().trim();
    if (processed !== undefined) query.processed = processed === "true";

    // Fetch errors
    const totalCount = await ErrorModel.countDocuments(query);
    const errorRecords = await ErrorModel.find(query)
      .select("service error statusCode fingerprint incidentId errorTimestamp processed")
      .sort({ createdAt: -1 })
      .limit(normalizedLimit)
      .skip(normalizedSkip)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        total: totalCount,
        limit: normalizedLimit,
        skip: normalizedSkip,
        count: errorRecords.length,
        errors: errorRecords,
      },
    });
  } catch (err) {
    console.error("❌ Get Recent Errors Error:", err.message);
    next(err);
  }
};

/**
 * GET /api/errors/:errorId
 * Get detailed error info
 */
export const getErrorById = async (req, res, next) => {
  try {
    const { errorId } = req.params;

    if (!req.user?.organizationId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const errorRecord = await ErrorModel.findOne({
      _id: errorId,
      organizationId: req.user.organizationId,
    }).populate("incidentId", "title severity status tags");

    if (!errorRecord) {
      return res.status(404).json({
        success: false,
        message: "Error not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: errorRecord,
    });
  } catch (err) {
    console.error("❌ Get Error By ID Error:", err.message);
    next(err);
  }
};

export default {
  intakeError,
  getRecentErrors,
  getErrorById,
};
