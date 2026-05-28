import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import ApiError from "../utils/api-error-handling";
import { env } from "../utils/secret";
import { getUserById } from "../services/user.services";

export const isAuthenticated = async function (
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    if (req.isAuthenticated()) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      const user = await getUserById(new Types.ObjectId(payload.userId));
      if (user) {
        req.user = user;
        return next();
      }
    }

    return next(new ApiError(401, "Unauthorized"));
  } catch (error) {
    return next(new ApiError(401, "Unauthorized - Invalid token"));
  }
};
