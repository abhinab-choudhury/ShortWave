import jwt, { SignOptions } from "jsonwebtoken";
import ApiError from "./api-error-handling";

type JwtPayload = {
  destination: string;
  code: string;
  [key: string]: unknown;
};

export const decodeToken = (secret: string, token?: string) => {
  if (!token) {
    throw new ApiError(400, "No token provided");
  }
  return jwt.verify(token, secret);
};

export const generateToken = (
  secret: string,
  payload: JwtPayload,
  options: SignOptions = { expiresIn: "60min" },
): string => {
  return jwt.sign(payload, secret, options);
};
