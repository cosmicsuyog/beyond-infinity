import express from "express";
import { body, param } from "express-validator";
import { intakeError, getRecentErrors, getErrorById } from "../controllers/error.controller.js";
import { verifyApiMiddleware } from "../middleware/verifyApi.middleware.js";
import { verifyJWTMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/errors/intake
 * Public endpoint - requires API key
 * Receive error from client system
 *
 * Headers: x-api-key: ops_<key>
 * Body: {
 *   service: "payment-service",
 *   error: "Payment timeout",
 *   statusCode: 504,
 *   stackTrace: "...",
 *   metadata: {...},
 *   timestamp: "2026-05-01T10:00:00Z"
 * }
 */
router.post(
  "/intake",
  verifyApiMiddleware, // Validates API key

  // Input validation
  body("service")
    .trim()
    .notEmpty()
    .withMessage("service is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("service must be 1-100 characters"),

  body("error")
    .trim()
    .notEmpty()
    .withMessage("error is required")
    .isLength({ min: 1, max: 2000 })
    .withMessage("error must be 1-2000 characters"),

  body("statusCode")
    .optional()
    .isInt({ min: 100, max: 599 })
    .withMessage("statusCode must be 100-599"),

  body("stackTrace")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("stackTrace must be max 5000 characters"),

  body("metadata").optional().isObject().withMessage("metadata must be an object"),

  body("timestamp").optional().isISO8601().withMessage("timestamp must be valid ISO8601 date"),

  intakeError
);

/**
 * GET /api/errors/recent
 * Protected endpoint - requires JWT authentication
 * Get recent errors for authenticated user's organization
 *
 * Query: ?limit=50&skip=0&service=payment&processed=false
 */
router.get("/recent", verifyJWTMiddleware, getRecentErrors);

/**
 * GET /api/errors/:errorId
 * Protected endpoint - requires JWT authentication
 * Get detailed error information
 */
router.get(
  "/:errorId",
  verifyJWTMiddleware,
  param("errorId").isMongoId().withMessage("Invalid error ID"),
  getErrorById
);

export default router;
