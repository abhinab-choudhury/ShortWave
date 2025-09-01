import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
  deleteUserUrl,
  getUserUrlDetails,
} from "../controllers/url.controller";

const router = express.Router();

/**
 * @route   GET /api/v1/url/:urlId
 * @desc    Get details of a specific short URL which includes analytics
 * @access  Authenticated
 */
router.get("/:urlId", isAuthenticated, getUserUrlDetails);

/**
 * @route   DELETE /api/v1/url/:shortLink
 * @desc    Delete a short URL
 * @access  Authenticated
 */
router.delete("/:shortLink", isAuthenticated, deleteUserUrl);

export default router;
