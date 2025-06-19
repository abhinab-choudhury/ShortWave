import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api-error-handling";
import rateLimit from "express-rate-limit";
import { decodeToken } from "../utils/token";
import { env } from "../utils/secrets";

export const authenticateToken = function(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if(!token) {
    res.send(new ApiError(401, "Unauthorized"));
  }
  try {
    const user = decodeToken(env.ACCESS_TOKEN_SECRET, token);
    req.user = user;
    next();
  } catch(e) {
    res.send(new ApiError(403, "Token invalid or expired"))
  }
}

export const AuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later."
})
