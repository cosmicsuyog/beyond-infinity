/**
 * Incident Routes
 * Handles incident CRUD, status updates, assignments, stats
 */

import express from "express";
import { body, param, query } from "express-validator";
import {
  createIncidentManual,
  getIncident,
  listIncidentsHandler,
  updateIncidentStatusHandler,
  assignIncident,
  getIncidentDashboardStats,
} from "../controllers/incident.controller.js";
import { verifyJWTMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// All incident routes require authentication
router.use(verifyJWTMiddleware);

/**
 * POST /api/incidents
 * Create new incident manually
 */
router.post(
  "/",
  body("title").trim().notEmpty().isLength({ min: 1, max: 200 }),
  body("description").optional().trim(),
  body("service").trim().notEmpty(),
  body("severity").isIn(["low", "medium", "high", "critical"]),
  body("tags").optional().isArray(),
  createIncidentManual
);

/**
 * GET /api/incidents
 * List incidents with filters
 */
router.get(
  "/",
  query("limit").optional().isInt({ min: 1, max: 500 }),
  query("skip").optional().isInt({ min: 0 }),
  query("status").optional().isIn(["open", "investigating", "identified", "resolved"]),
  query("severity").optional().isIn(["low", "medium", "high", "critical"]),
  query("service").optional().trim(),
  query("tags").optional(),
  listIncidentsHandler
);

/**
 * GET /api/incidents/dashboard/stats
 * Get incident stats for dashboard
 */
router.get("/dashboard/stats", getIncidentDashboardStats);

/**
 * GET /api/incidents/:id
 * Get single incident
 */
router.get("/:id", param("id").isMongoId(), getIncident);

/**
 * PUT /api/incidents/:id/status
 * Update incident status
 */
router.put(
  "/:id/status",
  param("id").isMongoId(),
  body("status").isIn(["open", "investigating", "identified", "resolved"]),
  updateIncidentStatusHandler
);

/**
 * POST /api/incidents/:id/assign
 * Assign incident to responders
 *
 * With auto-assign:
 * { autoAssign: true }
 *
 * Manual assign:
 * { userIds: ["userId1", "userId2"] }
 */
router.post(
  "/:id/assign",
  param("id").isMongoId(),
  body("autoAssign").optional().isBoolean(),
  body("userIds").optional().isArray(),
  assignIncident
);

export default router;
