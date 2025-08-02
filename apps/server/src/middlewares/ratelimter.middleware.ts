import rateLimit from "express-rate-limit";
import { makeIssue } from "zod";

export const signinRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 15,
  message: {
    status: 429,
    message: "Too many login attemps, please try again later.",
  },
});

export const oauthCallbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: {
    status: 429,
    message: "Too many auth attemps, try again later.",
  },
});
