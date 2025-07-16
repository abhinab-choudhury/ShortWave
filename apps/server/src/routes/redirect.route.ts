import express from "express";
import { handleRedirect } from "../controllers/redirect.controller";

const router = express.Router();

/**
 * @route   GET /:shortCode
 * @desc    Redirect to the original URL + log the click
 * @access  Public
 */
router.get("/:shortCode", handleRedirect);

export default router;
