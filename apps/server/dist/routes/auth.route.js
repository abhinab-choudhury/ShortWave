"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const passport_1 = __importDefault(require("passport"));
const secret_1 = require("../utils/secret");
const ratelimter_middleware_1 = require("../middlewares/ratelimter.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
require("./../strategies/google.strategy");
require("./../strategies/github.strategy");
const router = express_1.default.Router();
/**
 * @route   GET /api/v1/auth/me
 * @desc    Get the user details
 * @access  Private
 */
router.get("/me", auth_middleware_1.isAuthenticated, auth_controller_1.me);
/**
 * @route   POST /api/v1/auth/signin
 * @desc    Email-only login (e.g., OTP/magic link based)
 * @access  Public
 */
router.post("/signin", ratelimter_middleware_1.signinRateLimiter, auth_controller_1.signinUser);
/**
 * @route   GET /api/v1/auth/verify?token
 * @desc    Sign Verification (e.g., OTP/magic link based)
 * @access  Public
 */
router.get("/verify", ratelimter_middleware_1.signinRateLimiter, auth_controller_1.verifyToken);
/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout the User
 * @access  Public
 */
router.post("/logout", auth_controller_1.logoutUser);
/**
 * @route   GET /api/v1/auth/google
 * @desc    Initiates Google OAuth login
 * @access  Public
 */
router.get("/google", ratelimter_middleware_1.signinRateLimiter, passport_1.default.authenticate("google-strategy"), auth_controller_1.googleOAuth);
/**
 * @route   GET /api/v1/auth/google/callback
 * @desc    Handles Google OAuth callback and sets up session
 * @access  Public
 */
router.get("/google/callback", ratelimter_middleware_1.oauthCallbackLimiter, passport_1.default.authenticate("google-strategy", {
    failureRedirect: `${secret_1.env.CLIENT_URL}/signin`,
    keepSessionInfo: true,
}), auth_controller_1.googleOAuthCallback);
/**
 * @route   GET /api/v1/auth/github
 * @desc    Initiates GitHub OAuth login
 * @access  Public
 */
router.get("/github", ratelimter_middleware_1.signinRateLimiter, passport_1.default.authenticate("github-strategy"), auth_controller_1.githubOAuth);
/**
 * @route   GET /api/v1/auth/github/callback
 * @desc    Handles GitHub OAuth callback and sets up session
 * @access  Public
 */
router.get("/github/callback", ratelimter_middleware_1.oauthCallbackLimiter, passport_1.default.authenticate("github-strategy", {
    failureRedirect: `${secret_1.env.CLIENT_URL}/signin`,
    keepSessionInfo: true,
}), auth_controller_1.githubOAuthCallback);
exports.default = router;
