"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaign_controller_1 = require("../controllers/campaign.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const url_controller_1 = require("../controllers/url.controller");
const router = express_1.default.Router();
/**
 * @route   GET /api/v1/campaign
 * @desc    Get all campaigns of current user
 * @access  Authenticated
 */
router.get("/", auth_middleware_1.isAuthenticated, campaign_controller_1.getAllUserCampaigns);
/**
 * @route   POST /api/v1/campaign
 * @desc    Create a new campaign
 * @access  Authenticated
 */
router.post("/", auth_middleware_1.isAuthenticated, campaign_controller_1.createUserCampaign);
/*
 * @route GET /api/v1/campaign/stats
 * @desc Get the overall status of all the Campaigns which are active
 * @access Authenticated
 */
router.get("/stats", auth_middleware_1.isAuthenticated, campaign_controller_1.getUserCampaignStats);
/*
 * @route GET /api/v1/campaign/recent
 * @desc Get the recent campaigns which are recently created
 * @access Authenticated
 */
router.get("/recent", auth_middleware_1.isAuthenticated, campaign_controller_1.getUsersRecentCampaigns);
/**
 * @route   PATCH /api/v1/campaign/:campaignId
 * @desc    Update a campaign name
 * @access  Authenticated
 */
router.patch("/:campaignId", auth_middleware_1.isAuthenticated, campaign_controller_1.updateUserCampaign);
/**
 * @route   DELETE /api/v1/campaign/:campaignId
 * @desc    Delete a campaign
 * @access  Authenticated
 */
router.delete("/:campaignId", auth_middleware_1.isAuthenticated, campaign_controller_1.deleteUserCampaign);
/**
 * @route   POST /api/v1/campaign/:campaignId/url
 * @desc    Create a new short URL inside a campaign
 * @access  Authenticated
 */
router.post("/:campaignId/url", auth_middleware_1.isAuthenticated, url_controller_1.createUserUrl);
/**
 * @route   GET /api/v1/campaign/:campaignId/url
 * @desc    Get all URLs inside a campaign
 * @access  Authenticated
 */
router.get("/:campaignId/url", url_controller_1.getUserUrlsBycampaign);
exports.default = router;
