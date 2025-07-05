import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api-error-handling";

export const isAuthenticated = function (
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.isAuthenticated()) {
    return next();
  }
  next(new ApiError(401, "Unauthorized"));
};
