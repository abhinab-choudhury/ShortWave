// routes/dashboard-routes.ts
import express from "express";
// import { getUserDashboard } from "../controllers/dashboardController";
// import { isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

/**
 * @route   GET /dashboard
 * @desc    Get dashboard data (all workspaces + recent URLs)
 * @access  Private
 */
// router.get("/", isAuthenticatedUser, getUserDashboard);

export default router;
