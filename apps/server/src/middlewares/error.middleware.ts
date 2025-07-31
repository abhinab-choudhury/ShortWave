import { ErrorRequestHandler } from "express";
import { Response, Request, NextFunction } from "express";
import ApiError from "../utils/api-error-handling";
import ApiResponse from "../utils/api-response-handling";
import { env } from "../utils/secret";
import { z } from "zod";

const globalErrorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(
      new ApiResponse(error.statusCode, error.message, false, {
        errors: error.errors || [],
        stack: env.NODE_ENV === "development" ? error.stack : undefined,
      }),
    );
    return;
  }

  if (error instanceof z.ZodError) {
    res.status(400).json(
      new ApiResponse(
        400,
        "Validation Failed",
        false,
        error.issues.map((issue) => issue.message),
      ),
    );
  }

  res.status(500).json(
    new ApiResponse(500, "Internal Server Error", false, {
      errors: [error.message || "Unexpected error occurred"],
      stack: env.NODE_ENV === "development" ? error.stack : undefined,
    }),
  );
  return;
};

export default globalErrorHandler;
