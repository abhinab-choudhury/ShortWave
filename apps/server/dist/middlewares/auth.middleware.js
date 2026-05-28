"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const api_error_handling_1 = __importDefault(require("../utils/api-error-handling"));
const secret_1 = require("../utils/secret");
const user_services_1 = require("../services/user.services");
const isAuthenticated = function (req, _res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.isAuthenticated()) {
                return next();
            }
            const authHeader = req.headers.authorization;
            if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                const payload = jsonwebtoken_1.default.verify(token, secret_1.env.JWT_SECRET);
                const user = yield (0, user_services_1.getUserById)(new mongoose_1.Types.ObjectId(payload.userId));
                if (user) {
                    req.user = user;
                    return next();
                }
            }
            return next(new api_error_handling_1.default(401, "Unauthorized"));
        }
        catch (error) {
            return next(new api_error_handling_1.default(401, "Unauthorized - Invalid token"));
        }
    });
};
exports.isAuthenticated = isAuthenticated;
