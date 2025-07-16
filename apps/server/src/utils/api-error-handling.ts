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

export function normalizeError(err: any, defaultMessage: string): ApiError {
  if (err instanceof ApiError) return err;

  if (err instanceof z.ZodError)
    return new ApiError(
      400,
      "Validation Failed",
      err.issues.map((issue) => issue.message),
    );

  return new ApiError(500, defaultMessage, err);
}

export default ApiError;
