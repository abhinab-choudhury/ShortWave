import express from "express";
import {
  getAllUserCampaigns,
  createUserCampaign,
  deleteUserCampaign,
  updateUserCampaign,
  getUserCampaignStats,
  getUsersRecentCampaigns,
} from "../controllers/campaign.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
  createUserUrl,
  getUserUrlsBycampaign,
} from "../controllers/url.controller";

const router = express.Router();

/**
 * @route   GET /api/v1/campaign
 * @desc    Get all campaigns of current user
 * @access  Authenticated
 */
router.get("/", isAuthenticated, getAllUserCampaigns);

/**
 * @route   POST /api/v1/campaign
 * @desc    Create a new campaign
 * @access  Authenticated
 */
router.post("/", isAuthenticated, createUserCampaign);

/*
 * @route GET /api/v1/campaign/stats
 * @desc Get the overall status of all the Campaigns which are active
 * @access Authenticated
 */
router.get("/stats", isAuthenticated, getUserCampaignStats);

/*
 * @route GET /api/v1/campaign/recent
 * @desc Get the recent campaigns which are recently created
 * @access Authenticated
 */
router.get("/recent", isAuthenticated, getUsersRecentCampaigns);

/**
 * @route   PATCH /api/v1/campaign/:campaignId
 * @desc    Update a campaign name
 * @access  Authenticated
 */
router.patch("/:campaignId", isAuthenticated, updateUserCampaign);

/**
 * @route   DELETE /api/v1/campaign/:campaignId
 * @desc    Delete a campaign
 * @access  Authenticated
 */
router.delete("/:campaignId", isAuthenticated, deleteUserCampaign);

/**
 * @route   POST /api/v1/campaign/:campaignId/url
 * @desc    Create a new short URL inside a campaign
 * @access  Authenticated
 */
router.post("/:campaignId/url", isAuthenticated, createUserUrl);

/**
 * @route   GET /api/v1/campaign/:campaignId/url
 * @desc    Get all URLs inside a campaign
 * @access  Authenticated
 */
router.get("/:campaignId/url", getUserUrlsBycampaign);

export default router;
