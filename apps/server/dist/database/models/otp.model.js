"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    otpHash: { type: String, required: true },
    salt: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
}, { timestamps: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Otp = mongoose_1.default.model("Otp", otpSchema);
exports.default = Otp;
