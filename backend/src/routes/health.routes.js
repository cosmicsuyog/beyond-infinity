/**
 * Health Routes
 * Endpoints for reporting and retrieving service health
 */

import express from "express";
import { param } from "express-validator";
import { verifyJWTMiddleware } from "../middleware/auth.middleware.js";
import {
  reportHealth,
  getOrganizationHealth,
  getServiceHealth,
} from "../services/health/health.service.js";

const router = express.Router();
router.use(verifyJWTMiddleware);

/**
 * GET /api/health - Get all services health
 */
router.get("/", async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const health = await getOrganizationHealth(organizationId);

    res.json({
      success: true,
      data: health,
      count: health.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/health/:service - Get specific service health
 */
router.get("/:service", param("service").trim().toLowerCase(), async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { service } = req.params;

    const health = await getServiceHealth(organizationId, service);

    if (!health) {
      return res.status(404).json({
        success: false,
        message: `No health data for service: ${service}`,
      });
    }

    res.json({
      success: true,
      data: health,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/health/report - Report health status (internal endpoint)
 * Called by client services via API key
 */
router.post("/report", async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { service, status, metrics, message, details } = req.body;

    if (!service || !status) {
      return res.status(400).json({
        success: false,
        message: "service and status are required",
      });
    }

    const health = await reportHealth({
      organizationId,
      service: service.toLowerCase(),
      status,
      metrics: metrics || {},
      message,
      details,
    });

    res.json({
      success: true,
      data: health,
      message: "Health status updated",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
