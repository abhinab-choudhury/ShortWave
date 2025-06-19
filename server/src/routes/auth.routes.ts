// routes/auth-routes.ts
import express from "express";
// import passport from "passport";
// import {
//   loginUser,
//   googleOAuth,
//   githubOAuth,
//   getCurrentUser,
// } from "../controllers/auth.controllers";

const router = express.Router();

/**
 * @route   POST /auth/login
 * @desc    Login with email
 */
// router.post("/login", loginUser);

/**
 * @route   POST /auth/google
 * @desc    OAuth login using Google
 */
// router.post("/google", googleOAuth);

/**
 * @route   POST /auth/github
 * @desc    OAuth login using GitHub
 */
// router.post("/github", githubOAuth);

/**
 * @route   GET /auth/me
 * @desc    Get current logged-in user
 */
// router.get("/me", getCurrentUser);

export default router;
