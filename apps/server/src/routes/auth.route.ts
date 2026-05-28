import express from "express";
import {
  logoutUser,
  me,
  signinUser,
  verifyToken,
  googleOAuth,
  githubOAuth,
  googleOAuthCallback,
  githubOAuthCallback,
} from "../controllers/auth.controller";
import passport from "passport";
import { env } from "../utils/secret";
import {
  oauthCallbackLimiter,
  signinRateLimiter,
} from "../middlewares/ratelimter.middleware";
import { isAuthenticated } from "../middlewares/auth.middleware";
import "./../strategies/google.strategy";
import "./../strategies/github.strategy";

const router = express.Router();

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get the user details
 * @access  Private
 */
router.get("/me", isAuthenticated, me);

/**
 * @route   POST /api/v1/auth/signin
 * @desc    Email-only login (e.g., OTP/magic link based)
 * @access  Public
 */
router.post("/signin", signinRateLimiter, signinUser);

/**
 * @route   GET /api/v1/auth/verify?token
 * @desc    Sign Verification (e.g., OTP/magic link based)
 * @access  Public
 */
router.get("/verify", signinRateLimiter, verifyToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout the User
 * @access  Public
 */
router.post("/logout", logoutUser);

/**
 * @route   GET /api/v1/auth/google
 * @desc    Initiates Google OAuth login
 * @access  Public
 */
router.get(
  "/google",
  signinRateLimiter,
  passport.authenticate("google-strategy"),
  googleOAuth,
);

/**
 * @route   GET /api/v1/auth/google/callback
 * @desc    Handles Google OAuth callback and sets up session
 * @access  Public
 */
router.get(
  "/google/callback",
  oauthCallbackLimiter,
  passport.authenticate("google-strategy", {
    failureRedirect: `${env.CLIENT_URL}/signin`,
    keepSessionInfo: true,
  }),
  googleOAuthCallback,
);

/**
 * @route   GET /api/v1/auth/github
 * @desc    Initiates GitHub OAuth login
 * @access  Public
 */
router.get(
  "/github",
  signinRateLimiter,
  passport.authenticate("github-strategy"),
  githubOAuth,
);

/**
 * @route   GET /api/v1/auth/github/callback
 * @desc    Handles GitHub OAuth callback and sets up session
 * @access  Public
 */
router.get(
  "/github/callback",
  oauthCallbackLimiter,
  passport.authenticate("github-strategy", {
    failureRedirect: `${env.CLIENT_URL}/signin`,
    keepSessionInfo: true,
  }),
  githubOAuthCallback,
);

export default router;
