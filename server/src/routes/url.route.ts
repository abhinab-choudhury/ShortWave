import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
  deleteUserUrl,
  getUserUrlDetails,
  updateUserUrl,
} from "../controllers/url.controller";

const router = express.Router();

/**
 * @route   GET /api/v1/url/:urlId
 * @desc    Get details of a specific short URL
 * @access  Authenticated
 */
router.get("/:urlId", isAuthenticated, getUserUrlDetails);

/**
 * @route   PATCH /api/v1/url/:urlId
 * @desc    Update a short URL (e.g., change destination or metadata)
 * @access  Authenticated
 */
router.patch("/:urlId", isAuthenticated, updateUserUrl);

/**
 * @route   DELETE /api/v1/url/:urlId
 * @desc    Delete a short URL
 * @access  Authenticated
 */
router.delete("/:urlId", isAuthenticated, deleteUserUrl);

export default router;
