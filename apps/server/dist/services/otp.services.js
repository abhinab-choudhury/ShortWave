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
exports.OTP_TTL_MS = exports.OTP_MAX_ATTEMPTS = void 0;
exports.hashOtp = hashOtp;
exports.generateOtp = generateOtp;
exports.storeOtp = storeOtp;
exports.findOtpByEmail = findOtpByEmail;
exports.isOtpValid = isOtpValid;
exports.isOtpExpired = isOtpExpired;
exports.hasExceededMaxAttempts = hasExceededMaxAttempts;
const crypto_1 = __importDefault(require("crypto"));
const otp_model_1 = __importDefault(require("../database/models/otp.model"));
const OTP_LENGTH = 6;
const OTP_MAX_ATTEMPTS = 5;
exports.OTP_MAX_ATTEMPTS = OTP_MAX_ATTEMPTS;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
exports.OTP_TTL_MS = OTP_TTL_MS;
function hashOtp(otp, salt) {
    return crypto_1.default
        .createHash("sha256")
        .update(`${otp}:${salt}`)
        .digest("hex");
}
function generateOtp() {
    const otp = crypto_1.default
        .randomInt(0, 10 ** OTP_LENGTH)
        .toString()
        .padStart(OTP_LENGTH, "0");
    const salt = crypto_1.default.randomBytes(16).toString("hex");
    return { otp, otpHash: hashOtp(otp, salt), salt };
}
function storeOtp(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const { otp, otpHash, salt } = generateOtp();
        const expiresAt = new Date(Date.now() + OTP_TTL_MS);
        yield otp_model_1.default.findOneAndDelete({ email: email.toLowerCase() });
        yield otp_model_1.default.create({
            email: email.toLowerCase(),
            otpHash,
            salt,
            expiresAt,
            attempts: 0,
        });
        return otp;
    });
}
function findOtpByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield otp_model_1.default.findOne({ email: email.toLowerCase() });
    });
}
function isOtpValid(otp, record) {
    return hashOtp(otp, record.salt) === record.otpHash;
}
function isOtpExpired(record) {
    return record.expiresAt.getTime() < Date.now();
}
function hasExceededMaxAttempts(record) {
    return record.attempts >= OTP_MAX_ATTEMPTS;
}
