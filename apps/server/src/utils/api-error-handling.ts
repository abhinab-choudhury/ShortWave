import { z } from "zod";

class ApiError extends Error {
  statusCode: number;
  errors?: string[];
  stack?: string;

  constructor(
    statusCode = 500,
    message = "Something went wrong",
    errors?: string[],
    stack?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export function normalizeError(error: any, defaultMessage: string): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof z.ZodError)
    return new ApiError(
      400,
      "Validation Failed",
      error.issues.map((issue) => issue.message),
    );

  return new ApiError(500, defaultMessage, error);
}

export default ApiError;
