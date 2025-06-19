// routes/redirect-routes.ts
import express from "express";
import { handleRedirect } from "../controllers/redirectController";

const router = express.Router();

/**
 * @route   GET /:shortCode
 * @desc    Redirect to the original URL + log the click
 * @access  Public
 */
router.get("/:shortCode", handleRedirect);

export default router;
