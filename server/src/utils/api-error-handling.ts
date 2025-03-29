class ApiError extends Error {
  statusCode: number;
  message: string;
  error: Error[];
  success: boolean;
  data: null;
  stack?: string;

  constructor(
    statusCode: number = 500,
    message: string = "Something went wrong",
    error: Error[] = [],
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
