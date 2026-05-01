/**
 * Organization Routes
 * CRUD operations for organizations
 */

import express from "express";
import { body, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { verifyJWTMiddleware } from "../middleware/auth.middleware.js";
import OrganizationModel from "../models/organization.model.js";

const router = express.Router();
router.use(verifyJWTMiddleware);

/**
 * GET /api/organizations/:id
 * Get organization details
 */
router.get("/:id", param("id").custom(isValidObjectId), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    // Users can only view their own organization
    if (id !== organizationId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const org = await OrganizationModel.findById(id).select("-apiKey -webhooks").lean();

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.json({
      success: true,
      data: org,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/organizations/:id
 * Update organization details
 */
router.put(
  "/:id",
  param("id").custom(isValidObjectId),
  body("name").optional().trim().isLength({ min: 1, max: 100 }),
  body("description").optional().trim().isLength({ max: 500 }),
  body("contactEmail").optional().isEmail(),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { organizationId, role } = req.user;

      // Only admins can update org
      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      if (id !== organizationId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.contactEmail) updateData.contactEmail = req.body.contactEmail;

      const org = await OrganizationModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      res.json({
        success: true,
        data: org,
        message: "Organization updated",
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
