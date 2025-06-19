// routes/analytics-routes.ts
import express from "express";
import {
  getUrlAnalytics,
  getWorkspaceAnalytics,
  getDeviceBreakdown,
  getClickTrends,
} from "../controllers/analyticsController";
import { isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

/**
 * @route   GET /analytics/url/:urlId
 * @desc    Get full analytics for a single short URL
 * @access  Private
 */
router.get("/url/:urlId", isAuthenticatedUser, getUrlAnalytics);

/**
 * @route   GET /analytics/workspace/:workspaceId
 * @desc    Get overall analytics for a workspace (all URLs)
 * @access  Private
 */
router.get(
  "/workspace/:workspaceId",
  isAuthenticatedUser,
  getWorkspaceAnalytics,
);

/**
 * @route   GET /analytics/url/:urlId/devices
 * @desc    Breakdown of device types (mobile/desktop/tablet/bot) for a URL
 * @access  Private
 */
router.get("/url/:urlId/devices", isAuthenticatedUser, getDeviceBreakdown);

/**
 * @route   GET /analytics/url/:urlId/trends
 * @desc    Time-series click trends (e.g., clicks per day/week)
 * @access  Private
 */
router.get("/url/:urlId/trends", isAuthenticatedUser, getClickTrends);

export default router;
