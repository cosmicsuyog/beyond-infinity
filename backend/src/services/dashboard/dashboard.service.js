/**
 * Dashboard Service
 * Comprehensive incident and error analytics
 */

import IncidentModel from "../../models/incident.model.js";
import ErrorModel from "../../models/error.model.js";

/**
 * Get comprehensive dashboard stats
 */
export const getDashboardStats = async (organizationId) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Incidents
    const totalIncidents = await IncidentModel.countDocuments({
      organizationId,
    });
    const openIncidents = await IncidentModel.countDocuments({
      organizationId,
      status: { $in: ["open", "investigating"] },
    });
    const criticalIncidents = await IncidentModel.countDocuments({
      organizationId,
      severity: "critical",
    });
    const resolvedLast7Days = await IncidentModel.countDocuments({
      organizationId,
      status: "resolved",
      resolvedAt: { $gte: sevenDaysAgo },
    });

    // Calculate average resolution time (last 30 days)
    const resolvedIncidents = await IncidentModel.find({
      organizationId,
      status: "resolved",
      resolvedAt: { $gte: thirtyDaysAgo },
    });

    const avgResolutionTime =
      resolvedIncidents.length > 0
        ? resolvedIncidents.reduce((sum, inc) => sum + (inc.resolutionTime || 0), 0) /
          resolvedIncidents.length
        : 0;

    // Errors
    const totalErrors = await ErrorModel.countDocuments({
      organizationId,
    });
    const errorsLast24h = await ErrorModel.countDocuments({
      organizationId,
      createdAt: {
        $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
    });

    // Incidents by severity
    const incidentsBySeverity = await IncidentModel.aggregate([
      { $match: { organizationId } },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);

    // Incidents by status
    const incidentsByStatus = await IncidentModel.aggregate([
      { $match: { organizationId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Errors by service
    const errorsByService = await ErrorModel.aggregate([
      { $match: { organizationId } },
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Top responders by resolved incidents
    const topResponders = await IncidentModel.aggregate([
      { $match: { organizationId, status: "resolved" } },
      { $unwind: "$assignedTo" },
      { $group: { _id: "$assignedTo", resolved: { $sum: 1 } } },
      { $sort: { resolved: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);

    return {
      incidents: {
        total: totalIncidents,
        open: openIncidents,
        critical: criticalIncidents,
        resolvedLast7Days,
        avgResolutionTime: Math.round(avgResolutionTime / 60000), // ms to minutes
        bySeverity: incidentsBySeverity,
        byStatus: incidentsByStatus,
      },
      errors: {
        total: totalErrors,
        last24h: errorsLast24h,
        byService: errorsByService,
      },
      topResponders,
      timestamp: now,
    };
  } catch (err) {
    console.error("❌ Get Dashboard Stats Error:", err.message);
    throw err;
  }
};

/**
 * Get incident trend data (for charts)
 */
export const getIncidentTrend = async (organizationId, days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trend = await IncidentModel.aggregate([
      {
        $match: {
          organizationId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return trend;
  } catch (err) {
    console.error("❌ Get Incident Trend Error:", err.message);
    throw err;
  }
};

export default {
  getDashboardStats,
  getIncidentTrend,
};
