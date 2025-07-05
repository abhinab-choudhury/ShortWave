import { ErrorRequestHandler } from "express";
import { Response, Request, NextFunction } from "express";
import ApiError from "../utils/api-error-handling";
import ApiResponse from "../utils/api-response-handling";
import { env } from "../utils/secret";
import { z } from "zod";

const globalErrorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      new ApiResponse(err.statusCode, err.message, false, {
        errors: err.errors || [],
        stack: env.NODE_ENV === "development" ? err.stack : undefined,
      }),
    );
    return;
  }

  if (err instanceof z.ZodError) {
    res.status(400).json(
      new ApiResponse(
        400,
        "Validation Failed",
        false,
        err.issues.map((issue) => issue.message),
      ),
    );
  }

  res.status(500).json(
    new ApiResponse(500, "Internal Server Error", false, {
      errors: [err.message || "Unexpected error occurred"],
      stack: env.NODE_ENV === "development" ? err.stack : undefined,
    }),
  );
  return;
};

export default globalErrorHandler;
