import jwt, { SignOptions } from "jsonwebtoken";
import ApiError from "./api-error-handling";
import { env } from "./secrets";

export const decodeToken = (secret: string, token?: string) => {
  if (!token) {
    throw new ApiError(400, "No token provided");
  }
  return jwt.verify(token, secret);
};

export const generateAccessToken = (userId: string) =>
  jwt.sign({ userId }, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] });

export const generateRefreshToken = (userId: string) =>
  jwt.sign({ userId }, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] });
