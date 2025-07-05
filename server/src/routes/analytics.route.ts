// routes/analytics-routes.ts
import express from "express";
import {
  getCampaignAnalytics,
  getClickTrends,
  getDeviceBreakdown,
  getUrlAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @route   GET /analytics/u/:userId
 * @desc    Get overall analytics for all Campaign for a specific user
 * @access  Private
 */
router.get("/u/:userId", isAuthenticated, getUserAnalytics);

/**
 * @route   GET /analytics/:campaignId
 * @desc    Get overall analytics for a Campaign (all URLs)
 * @access  Private
 */
router.get("/:campaignId", isAuthenticated, getCampaignAnalytics);

/**
 * @route   GET /analytics/url/:urlId
 * @desc    Get full analytics for a single short URL
 * @access  Private
 */
router.get("/url/:urlId", isAuthenticated, getUrlAnalytics);

/**
 * @route   GET /analytics/url/:urlId/devices
 * @desc    Breakdown of device types (mobile/desktop/tablet/bot) for a URL
 * @access  Private
 */
router.get("/url/:urlId/devices", isAuthenticated, getDeviceBreakdown);

/**
 * @route   GET /analytics/url/:urlId/trends
 * @desc    Time-series click trends (e.g., clicks per day/week)
 * @access  Private
 */
router.get("/url/:urlId/trends", isAuthenticated, getClickTrends);

export default router;
