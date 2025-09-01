"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_handling_1 = __importDefault(require("../utils/api-error-handling"));
const api_response_handling_1 = __importDefault(require("../utils/api-response-handling"));
const secret_1 = require("../utils/secret");
const zod_1 = require("zod");
const globalErrorHandler = (error, _req, res, _next) => {
    if (error instanceof api_error_handling_1.default) {
        res.status(error.statusCode).json(new api_response_handling_1.default(error.statusCode, error.message, false, {
            errors: error.errors || [],
            stack: secret_1.env.NODE_ENV === "development" ? error.stack : undefined,
        }));
        return;
    }
    if (error instanceof zod_1.z.ZodError) {
        res.status(400).json(new api_response_handling_1.default(400, "Validation Failed", false, error.issues.map((issue) => issue.message)));
    }
    res.status(500).json(new api_response_handling_1.default(500, "Internal Server Error", false, {
        errors: [error.message || "Unexpected error occurred"],
        stack: secret_1.env.NODE_ENV === "development" ? error.stack : undefined,
    }));
    return;
};
exports.default = globalErrorHandler;
