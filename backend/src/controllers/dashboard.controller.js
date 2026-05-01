/**
 * Dashboard Controller
 * Endpoints for analytics and insights
 */

import { getDashboardStats, getIncidentTrend } from "../services/dashboard/dashboard.service.js";

/**
 * GET /api/dashboard/stats
 * Get comprehensive dashboard statistics
 */
export const getDashboardStatsHandler = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    const stats = await getDashboardStats(organizationId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/trends
 * Get incident trend data for charts
 */
export const getIncidentTrendHandler = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { days = 7 } = req.query;

    const trend = await getIncidentTrend(organizationId, parseInt(days));

    res.json({
      success: true,
      data: trend,
      period: `${days} days`,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getDashboardStatsHandler,
  getIncidentTrendHandler,
};
