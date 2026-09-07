import crypto from "crypto";
import Otp from "../database/models/otp.model";
import { IOtp } from "../interfaces/model";

const OTP_LENGTH = 6;
const OTP_MAX_ATTEMPTS = 5;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function hashOtp(otp: string, salt: string): string {
  return crypto
    .createHash("sha256")
    .update(`${otp}:${salt}`)
    .digest("hex");
}

export function generateOtp(): {
  otp: string;
  otpHash: string;
  salt: string;
} {
  const otp = crypto
    .randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");
  const salt = crypto.randomBytes(16).toString("hex");
  return { otp, otpHash: hashOtp(otp, salt), salt };
}

export async function storeOtp(email: string): Promise<string> {
  const { otp, otpHash, salt } = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  await Otp.findOneAndDelete({ email: email.toLowerCase() });
  await Otp.create({
    email: email.toLowerCase(),
    otpHash,
    salt,
    expiresAt,
    attempts: 0,
  });
  return otp;
}

export async function findOtpByEmail(
  email: string,
): Promise<IOtp | null> {
  return await Otp.findOne({ email: email.toLowerCase() });
}

export function isOtpValid(otp: string, record: IOtp): boolean {
  return hashOtp(otp, record.salt) === record.otpHash;
}

export function isOtpExpired(record: IOtp): boolean {
  return record.expiresAt.getTime() < Date.now();
}

export function hasExceededMaxAttempts(record: IOtp): boolean {
  return record.attempts >= OTP_MAX_ATTEMPTS;
}

export { OTP_MAX_ATTEMPTS, OTP_TTL_MS };
