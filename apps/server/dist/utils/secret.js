"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getEnv = (key, required = true, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (required && !value) {
        console.error(`Environment variable ${key} is required but not defined.`);
        process.exit(1);
    }
    return value;
};
exports.env = {
    PORT: getEnv("PORT", false, "8080"),
    NODE_ENV: getEnv("NODE_ENV", false, "development"), // development | production
    CLIENT_URL: getEnv("CLIENT_URL", false, "http://localhost:5173"),
    SERVER_URL: getEnv("SERVER_URL", false, "http://localhost:8080"),
    EMAIL: getEnv("EMAIL"),
    EMAIL_PASSWORD: getEnv("EMAIL_PASSWORD"),
    MONGODB_BASE_URI: getEnv("MONGODB_BASE_URI", false, "mongodb://localhost:27017"),
    REDIS_URL: getEnv("REDIS_URL", false, "redis://localhost:6379"),
    DATABASE_NAME: getEnv("DATABASE_NAME", false, "mydatabase"),
    SESSION_SECRET: getEnv("SESSION_SECRET"),
    JWT_SECRET: getEnv("JWT_SECRET"),
    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GITHUB_CLIENT_ID: getEnv("GITHUB_CLIENT_ID"),
    GITHUB_CLIENT_SECRET: getEnv("GITHUB_CLIENT_SECRET"),
};
