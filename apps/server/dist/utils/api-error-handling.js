"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeError = normalizeError;
const zod_1 = require("zod");
class ApiError extends Error {
    constructor(statusCode = 500, message = "Something went wrong", errors, stack) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
function normalizeError(error, defaultMessage) {
    if (error instanceof ApiError)
        return error;
    if (error instanceof zod_1.z.ZodError)
        return new ApiError(400, "Validation Failed", error.issues.map((issue) => issue.message));
    return new ApiError(500, defaultMessage, error);
}
exports.default = ApiError;
