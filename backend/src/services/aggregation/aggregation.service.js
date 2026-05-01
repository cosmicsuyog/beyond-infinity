/**
 * Aggregation Service
 * Groups similar errors together and determines when to create incidents
 * Uses hybrid Redis (cache) + MongoDB (persistence) approach
 */

import redisClient from "../../config/redis/redis.config.js";
import ErrorModel from "../../models/error.model.js";
import {
  getAggregationKey,
  getGroupInfo,
  incrementGroupCount,
  shouldCreateIncident,
} from "../../utils/aggregation/errorFingerprint.js";
import { ENV } from "../../config/env.config.js";

/**
 * Get or initialize error group in Redis
 * Returns current group state (count, timestamps)
 *
 * @param {string} fingerprint - Error fingerprint
 * @param {object} options - Configuration options
 * @returns {Promise<{count: number, severity: string, shouldCreate: boolean}>}
 */
export const getErrorGroup = async (fingerprint) => {
  try {
    const aggregationKey = getAggregationKey(fingerprint);
    const groupInfo = await getGroupInfo(redisClient, aggregationKey);

    return {
      exists: !!groupInfo,
      count: groupInfo?.count || 0,
      lastErrorAt: groupInfo?.lastErrorAt || null,
      createdAt: groupInfo?.createdAt || null,
    };
  } catch (err) {
    console.error("❌ Get Error Group Error:", err.message);
    throw new Error("Failed to fetch error group");
  }
};

/**
 * Process incoming error - group it and check threshold
 * Returns aggregation result with incident creation recommendation
 *
 * @param {object} errorData - Error data
 * @param {string} errorData.organizationId - Organization ID
 * @param {string} errorData.service - Service name
 * @param {string} errorData.error - Error message
 * @param {string} errorData.fingerprint - Pre-calculated fingerprint
 * @returns {Promise<{groupCount: number, severity: string, shouldCreate: boolean, incidentSeverity: string}>}
 */
export const aggregateError = async (errorData) => {
  const { fingerprint } = errorData;

  if (!fingerprint) {
    throw new Error("fingerprint is required");
  }

  try {
    const aggregationKey = getAggregationKey(fingerprint);
    const windowSeconds = ENV.AGGREGATION.WINDOW_SECONDS;

    // Increment count in Redis (sliding window TTL)
    const groupInfo = await incrementGroupCount(redisClient, aggregationKey, windowSeconds);

    // Build thresholds object from ENV
    const thresholds = {
      LOW: ENV.AGGREGATION.THRESHOLD_LOW,
      MEDIUM: ENV.AGGREGATION.THRESHOLD_MEDIUM,
      HIGH: ENV.AGGREGATION.THRESHOLD_HIGH,
      CRITICAL: ENV.AGGREGATION.THRESHOLD_CRITICAL,
    };

    // Check if we should create incident
    const suggestedSeverity = shouldCreateIncident(groupInfo.count, thresholds);

    return {
      groupCount: groupInfo.count,
      severity: suggestedSeverity,
      shouldCreate: suggestedSeverity !== null,
      groupInfo,
    };
  } catch (err) {
    console.error("❌ Aggregate Error Error:", err.message);
    throw new Error("Failed to aggregate error");
  }
};

/**
 * Get all errors in a group (for linking to incident)
 *
 * @param {string} organizationId - Organization ID
 * @param {string} fingerprint - Error fingerprint
 * @returns {Promise<Array>} Array of error records
 */
export const getErrorsInGroup = async (organizationId, fingerprint) => {
  try {
    const errors = await ErrorModel.find({
      organizationId,
      fingerprint,
      processed: false, // Only unprocessed errors
    })
      .select("service error statusCode errorTimestamp metadata")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return errors;
  } catch (err) {
    console.error("❌ Get Errors In Group Error:", err.message);
    throw new Error("Failed to fetch errors in group");
  }
};

/**
 * Mark errors as processed (linked to incident)
 *
 * @param {string} organizationId - Organization ID
 * @param {string} fingerprint - Error fingerprint
 * @param {string} incidentId - Incident ID to link
 * @returns {Promise<{modifiedCount: number}>}
 */
export const markErrorsProcessed = async (organizationId, fingerprint, incidentId) => {
  try {
    const result = await ErrorModel.updateMany(
      {
        organizationId,
        fingerprint,
        processed: false,
      },
      {
        processed: true,
        incidentId,
      }
    );

    return {
      modifiedCount: result.modifiedCount,
    };
  } catch (err) {
    console.error("❌ Mark Errors Processed Error:", err.message);
    throw new Error("Failed to mark errors as processed");
  }
};

/**
 * Reset aggregation group (clear from Redis)
 * Used when incident is resolved or for manual cleanup
 *
 * @param {string} fingerprint - Error fingerprint
 * @returns {Promise<boolean>} Whether key was deleted
 */
export const resetAggregationGroup = async (fingerprint) => {
  try {
    const aggregationKey = getAggregationKey(fingerprint);
    const deleted = await redisClient.del(aggregationKey);
    return deleted > 0;
  } catch (err) {
    console.error("❌ Reset Aggregation Group Error:", err.message);
    throw new Error("Failed to reset aggregation group");
  }
};

/**
 * Get aggregation stats for organization
 * Used for dashboard and monitoring
 *
 * @param {string} organizationId - Organization ID
 * @returns {Promise<object>} Aggregation statistics
 */
export const getAggregationStats = async (organizationId) => {
  try {
    // Count unprocessed errors by fingerprint
    const groups = await ErrorModel.aggregate([
      {
        $match: {
          organizationId,
          processed: false,
        },
      },
      {
        $group: {
          _id: "$fingerprint",
          count: { $sum: 1 },
          service: { $first: "$service" },
          lastError: { $max: "$errorTimestamp" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 50, // Top 50 groups
      },
    ]);

    // Build thresholds for reference
    const thresholds = {
      LOW: ENV.AGGREGATION.THRESHOLD_LOW,
      MEDIUM: ENV.AGGREGATION.THRESHOLD_MEDIUM,
      HIGH: ENV.AGGREGATION.THRESHOLD_HIGH,
      CRITICAL: ENV.AGGREGATION.THRESHOLD_CRITICAL,
    };

    // Calculate stats
    const stats = {
      totalGroups: groups.length,
      groupsNeedingIncident: groups.filter((g) => shouldCreateIncident(g.count, thresholds)).length,
      totalUnprocessedErrors: groups.reduce((sum, g) => sum + g.count, 0),
      topGroups: groups,
      thresholds,
    };

    return stats;
  } catch (err) {
    console.error("❌ Get Aggregation Stats Error:", err.message);
    throw new Error("Failed to fetch aggregation stats");
  }
};

export default {
  getErrorGroup,
  aggregateError,
  getErrorsInGroup,
  markErrorsProcessed,
  resetAggregationGroup,
  getAggregationStats,
};
