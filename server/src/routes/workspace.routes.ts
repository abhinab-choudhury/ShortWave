// routes/workspace-routes.ts
import express from "express";
import {
  getAllWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workspaceController";
import { isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

/**
 * @route   GET /workspaces
 * @desc    Get all workspaces of current user
 * @access  Private
 */
router.get("/", isAuthenticatedUser, getAllWorkspaces);

/**
 * @route   POST /workspaces
 * @desc    Create a new workspace
 * @access  Private
 */
router.post("/", isAuthenticatedUser, createWorkspace);

/**
 * @route   GET /workspaces/:id
 * @desc    Get details of a specific workspace
 * @access  Private
 */
router.get("/:id", isAuthenticatedUser, getWorkspaceById);

/**
 * @route   PATCH /workspaces/:id
 * @desc    Update a workspace name
 * @access  Private
 */
router.patch("/:id", isAuthenticatedUser, updateWorkspace);

/**
 * @route   DELETE /workspaces/:id
 * @desc    Delete a workspace
 * @access  Private
 */
router.delete("/:id", isAuthenticatedUser, deleteWorkspace);

export default router;
