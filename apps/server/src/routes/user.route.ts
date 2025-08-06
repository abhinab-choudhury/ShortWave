import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { changeUsersUsername } from "../controllers/user.controller";

const router = express.Router();

/**
 * @route POST /api/v1/user/change-username
 * @dec Change the username of the logged in user
 * @access Private
 */

router.post("/change-username", isAuthenticated, changeUsersUsername);

export default router;
