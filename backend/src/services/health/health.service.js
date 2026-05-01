/**
 * Health Service
 * Manages service health status and metrics
 */

import HealthModel from "../../models/health.model.js";

/**
 * Report health status
 */
export const reportHealth = async ({
  organizationId,
  service,
  status,
  metrics = {},
  message = null,
  details = null,
}) => {
  try {
    const health = await HealthModel.findOneAndUpdate(
      { organizationId, service },
      {
        status,
        metrics,
        message,
        details,
        lastReportedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return health;
  } catch (err) {
    console.error("❌ Report Health Error:", err.message);
    throw err;
  }
};

/**
 * Get health for all services
 */
export const getOrganizationHealth = async (organizationId) => {
  try {
    const health = await HealthModel.find({ organizationId }).lean();
    return health;
  } catch (err) {
    console.error("❌ Get Organization Health Error:", err.message);
    throw err;
  }
};

/**
 * Get health for single service
 */
export const getServiceHealth = async (organizationId, service) => {
  try {
    const health = await HealthModel.findOne({
      organizationId,
      service: service.toLowerCase(),
    }).lean();
    return health;
  } catch (err) {
    console.error("❌ Get Service Health Error:", err.message);
    throw err;
  }
};

export default {
  reportHealth,
  getOrganizationHealth,
  getServiceHealth,
};
