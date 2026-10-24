import { ErrorRequestHandler } from "express";
import { Response, Request, NextFunction } from "express";
import ApiError from "../utils/api-error-handling";
import ApiResponse from "../utils/api-response-handling";
import { env } from "../utils/secret";
import { z } from "zod";

const globalErrorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Don't leak auth/session/mongoose errors on redirect routes (/:shortCode)
  const path = req.path || "";
  const shortCodeMatch = path.match(/^\/([A-Za-z0-9_-]+)$/);
  if (shortCodeMatch && req.method === "GET") {
    const shortCode = shortCodeMatch[1];
    // Avoid intercepting known API/cron/routes
    if (
      shortCode !== "api" &&
      shortCode !== "cron" &&
      shortCode !== "health" &&
      shortCode !== "favicon.ico"
    ) {
      return res.status(404).end();
    }
  }

  if (error instanceof ApiError) {
    const data: any = {
      errors: error.errors || [],
    };
    if (env.NODE_ENV === "development") {
      data.stack = error.stack;
    }
    res.status(error.statusCode).json(
      new ApiResponse(error.statusCode, error.message, false, data),
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
    return;
  }

  const data500: any = {
    errors: [error.message || "Unexpected error occurred"],
  };
  if (env.NODE_ENV === "development") {
    data500.stack = error.stack;
  }
  res.status(500).json(
    new ApiResponse(500, "Internal Server Error", false, data500),
  );
  return;
};

export default globalErrorHandler;
