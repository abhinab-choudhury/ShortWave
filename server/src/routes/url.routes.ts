// routes/url-routes.ts
import express from "express";
import {
  createUrl,
  getUrlsByWorkspace,
  getUrlDetails,
  updateUrl,
  deleteUrl,
} from "../controllers/urlController";
import { isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

/**
 * @route   POST /workspaces/:workspaceId/urls
 * @desc    Create a new short URL inside a workspace
 * @access  Private
 */
router.post("/workspaces/:workspaceId/urls", isAuthenticatedUser, createUrl);

/**
 * @route   GET /workspaces/:workspaceId/urls
 * @desc    Get all URLs inside a workspace
 * @access  Private
 */
router.get(
  "/workspaces/:workspaceId/urls",
  isAuthenticatedUser,
  getUrlsByWorkspace,
);

/**
 * @route   GET /urls/:urlId
 * @desc    Get details of a specific short URL
 * @access  Private
 */
router.get("/urls/:urlId", isAuthenticatedUser, getUrlDetails);

/**
 * @route   PATCH /urls/:urlId
 * @desc    Update a short URL (e.g., change destination or metadata)
 * @access  Private
 */
router.patch("/urls/:urlId", isAuthenticatedUser, updateUrl);

/**
 * @route   DELETE /urls/:urlId
 * @desc    Delete a short URL
 * @access  Private
 */
router.delete("/urls/:urlId", isAuthenticatedUser, deleteUrl);

export default router;
