/**
 * Error Fingerprint Generation
 * Creates deterministic hash for error grouping
 * Same error fingerprint = same incident group
 */

import crypto from "crypto";

/**
 * Generate a deterministic fingerprint for an error
 * Used to group similar errors together for incident aggregation
 *
 * @param {string} organizationId - Organization ID
 * @param {string} service - Service name (e.g., "payment-service")
 * @param {string} errorMessage - Error message/description
 * @returns {string} SHA256 hash (hex format)
 *
 * @example
 * const fp = generateErrorFingerprint("org123", "payment", "Payment timeout")
 * // Returns: "a1b2c3d4e5f6..." - same input always returns same hash
 */
export const generateErrorFingerprint = (organizationId, service, errorMessage) => {
  if (!organizationId || !service || !errorMessage) {
    throw new Error("organizationId, service, and errorMessage are required");
  }

  // Create normalized input for consistency
  // - Lowercase service and org for case-insensitive matching
  // - Trim and normalize error message
  const normalizedData = `${organizationId.toLowerCase()}|${service.toLowerCase()}|${errorMessage
    .trim()
    .toLowerCase()}`;

  // Generate deterministic SHA256 hash
  const hash = crypto.createHash("sha256").update(normalizedData).digest("hex");

  return hash;
};

/**
 * Generate aggregation key for Redis caching
 * Used to quickly check if error group exists
 *
 * @param {string} fingerprint - Error fingerprint (from generateErrorFingerprint)
 * @returns {string} Redis key format: "error_group:<fingerprint>"
 *
 * @example
 * const key = getAggregationKey("a1b2c3d4...")
 * // Returns: "error_group:a1b2c3d4..."
 */
export const getAggregationKey = (fingerprint) => {
  if (!fingerprint) {
    throw new Error("fingerprint is required");
  }
  return `error_group:${fingerprint}`;
};

/**
 * Get aggregation group info
 * Retrieves current state of error group from Redis
 *
 * @param {object} redisClient - ioredis client instance
 * @param {string} key - Aggregation key (from getAggregationKey)
 * @returns {Promise<{count: number, lastErrorAt: string, createdAt: string}>}
 *
 * @example
 * const groupInfo = await getGroupInfo(redis, "error_group:abc123")
 * // Returns: { count: 5, lastErrorAt: "2026-05-01T10:30:00Z", createdAt: "2026-05-01T10:00:00Z" }
 */
export const getGroupInfo = async (redisClient, key) => {
  const data = await redisClient.get(key);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error parsing Redis aggregation data:", err.message);
    return null;
  }
};

/**
 * Increment error group count in Redis
 * Updates last occurrence timestamp and sliding TTL
 *
 * @param {object} redisClient - ioredis client instance
 * @param {string} key - Aggregation key
 * @param {number} ttl - Time-to-live in seconds (default: 3600)
 * @returns {Promise<{count: number, lastErrorAt: string, createdAt: string}>}
 */
export const incrementGroupCount = async (redisClient, key, ttl = 3600) => {
  const existing = await getGroupInfo(redisClient, key);

  const now = new Date().toISOString();

  const updated = {
    count: (existing?.count || 0) + 1,
    lastErrorAt: now,
    createdAt: existing?.createdAt || now,
  };

  // Store in Redis with TTL (sliding window - restarts on each error)
  await redisClient.setex(key, ttl, JSON.stringify(updated));

  return updated;
};

/**
 * Check if error group should trigger incident creation
 * Based on count threshold
 *
 * @param {number} errorCount - Current error count in group
 * @param {object} thresholds - Aggregation thresholds object
 * @returns {string|null} Suggested severity (low/medium/high/critical) or null if below all thresholds
 *
 * @example
 * const severity = shouldCreateIncident(15, { LOW: 5, MEDIUM: 10, HIGH: 20 })
 * // Returns: "medium" (15 >= 10 but < 20)
 */
export const shouldCreateIncident = (errorCount, thresholds) => {
  if (!thresholds) return null;

  // Check from highest to lowest severity
  if (errorCount >= thresholds.CRITICAL) return "critical";
  if (errorCount >= thresholds.HIGH) return "high";
  if (errorCount >= thresholds.MEDIUM) return "medium";
  if (errorCount >= thresholds.LOW) return "low";

  return null; // Below all thresholds
};

export default {
  generateErrorFingerprint,
  getAggregationKey,
  getGroupInfo,
  incrementGroupCount,
  shouldCreateIncident,
};
