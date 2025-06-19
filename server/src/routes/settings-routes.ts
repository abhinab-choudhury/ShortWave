// routes/settings-routes.ts

import express from "express";
import { getSettings } from "../controllers/settingsController";
import { isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

/**
 * @route   GET /settings
 * @desc    Get logged-in user's settings info
 *          Includes user profile, auth provider,
 *          and some summary stats like workspaces count, URLs count
 * @access  Private (requires authentication)
 */
router.get("/", isAuthenticatedUser, getSettings);

export default router;
