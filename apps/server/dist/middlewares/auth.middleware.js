"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const api_error_handling_1 = __importDefault(require("../utils/api-error-handling"));
const isAuthenticated = function (req, _res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    next(new api_error_handling_1.default(401, "Unauthorized"));
};
exports.isAuthenticated = isAuthenticated;
