/**
 * Dashboard Routes
 * Analytics and reporting endpoints
 */

import express from "express";
import { query } from "express-validator";
import { verifyJWTMiddleware } from "../middleware/auth.middleware.js";
import {
  getDashboardStatsHandler,
  getIncidentTrendHandler,
} from "../controllers/dashboard.controller.js";

const router = express.Router();
router.use(verifyJWTMiddleware);

/**
 * GET /api/dashboard/stats
 */
router.get("/stats", getDashboardStatsHandler);

/**
 * GET /api/dashboard/trends
 */
router.get("/trends", query("days").optional().isInt({ min: 1, max: 90 }), getIncidentTrendHandler);

export default router;
