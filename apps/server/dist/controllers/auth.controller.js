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
exports.requestOtp = requestOtp;
exports.verifyOtp = verifyOtp;
exports.me = me;
exports.signinUser = signinUser;
exports.verifyToken = verifyToken;
exports.logoutUser = logoutUser;
exports.googleOAuthCallback = googleOAuthCallback;
exports.githubOAuthCallback = githubOAuthCallback;
exports.googleOAuth = googleOAuth;
exports.githubOAuth = githubOAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const api_error_handling_1 = __importDefault(require("../utils/api-error-handling"));
const user_services_1 = require("../services/user.services");
const zod_1 = require("zod");
const secret_1 = require("../utils/secret");
const blockjwt_service_1 = require("../services/blockjwt.service");
const otp_model_1 = __importDefault(require("../database/models/otp.model"));
const otp_services_1 = require("../services/otp.services");
const email_1 = require("../utils/email");
const api_response_handling_1 = __importDefault(require("../utils/api-response-handling"));
const signinReqSchema = zod_1.z.object({
    email: zod_1.z.string().email().trim(),
});
const verifyOtpReqSchema = zod_1.z.object({
    email: zod_1.z.string().email().trim(),
    otp: zod_1.z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});
function isNativeRequest(req) {
    return (req.query.platform === "native" ||
        req.query.state === "native" ||
        req.headers["x-native-platform"] === "capacitor" ||
        (typeof req.headers.origin === "string" &&
            req.headers.origin.includes("capacitor://")));
}
function requestOtp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const parsed = verifyOtpReqSchema
                .pick({ email: true })
                .parse((_a = req.body.data) !== null && _a !== void 0 ? _a : req.body);
            let user = yield (0, user_services_1.getUserByEmail)(parsed.email);
            if (!user) {
                const newUser = {
                    email: parsed.email,
                    name: (_b = parsed.email.split("@")) === null || _b === void 0 ? void 0 : _b[0],
                    admin: false,
                };
                yield (0, email_1.sendWelcomeEmail)(newUser.name, newUser.email);
                user = yield (0, user_services_1.createUser)(newUser);
            }
            const otp = yield (0, otp_services_1.storeOtp)(parsed.email);
            yield (0, email_1.sendOtpEmail)(user.email, user.name, otp);
            res.status(200).json(new api_response_handling_1.default(200, "A 6-digit verification code has been sent to your email.", true, { expiresInSeconds: otp_services_1.OTP_TTL_MS / 1000 }));
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
                return next(new api_error_handling_1.default(400, "Validation failed", messages));
            }
            console.log("Error requesting OTP: ", error);
            return next(new api_error_handling_1.default(500, "Unexprected error occurred", error));
        }
    });
}
function verifyOtp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const parsed = verifyOtpReqSchema.parse((_a = req.body.data) !== null && _a !== void 0 ? _a : req.body);
            const record = yield (0, otp_services_1.findOtpByEmail)(parsed.email);
            if (!record) {
                return next(new api_error_handling_1.default(400, "No verification code found for this email. Please request a new one."));
            }
            if ((0, otp_services_1.isOtpExpired)(record)) {
                yield otp_model_1.default.findOneAndDelete({ email: parsed.email.toLowerCase() });
                return next(new api_error_handling_1.default(400, "This code has expired. Please request a new one."));
            }
            if (!(0, otp_services_1.isOtpValid)(parsed.otp, record)) {
                record.attempts += 1;
                yield record.save();
                if ((0, otp_services_1.hasExceededMaxAttempts)(record)) {
                    yield otp_model_1.default.findOneAndDelete({ email: parsed.email.toLowerCase() });
                    return next(new api_error_handling_1.default(400, "Too many incorrect attempts. Please request a new code."));
                }
                const remaining = otp_services_1.OTP_MAX_ATTEMPTS - record.attempts;
                return next(new api_error_handling_1.default(400, `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`));
            }
            const user = yield (0, user_services_1.getUserByEmail)(parsed.email);
            if (!user)
                return next(new api_error_handling_1.default(400, "User not found"));
            yield otp_model_1.default.findOneAndDelete({ email: parsed.email.toLowerCase() });
            const authToken = generateAuthToken(user._id);
            res.status(200).json(new api_response_handling_1.default(200, "Sign-in successful", true, {
                token: authToken,
                user: {
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    profilePic: user.profilePic,
                },
            }));
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
                return next(new api_error_handling_1.default(400, "Validation failed", messages));
            }
            console.log("Error verifying OTP: ", error);
            return next(new api_error_handling_1.default(500, "Unexprected error occurred", error));
        }
    });
}
function me(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) {
            const token = generateAuthToken(req.user._id);
            res.status(200).json(new api_response_handling_1.default(200, "User Authenticated", true, {
                user: {
                    userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                    email: (_c = req.user) === null || _c === void 0 ? void 0 : _c.email,
                    name: (_d = req.user) === null || _d === void 0 ? void 0 : _d.name,
                    profilePic: (_e = req.user) === null || _e === void 0 ? void 0 : _e.profilePic,
                },
                token,
            }));
        }
        else {
            return next(new api_error_handling_1.default(401, "User Unauthorized"));
        }
    });
}
function signinUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const parsedReq = signinReqSchema.parse(req.body.data);
            let user = (yield (0, user_services_1.getUserByEmail)(parsedReq.email));
            let userId;
            if (!user) {
                const newUser = {
                    email: parsedReq.email,
                    name: (_a = parsedReq.email.split("@")) === null || _a === void 0 ? void 0 : _a[0],
                    admin: false,
                };
                yield (0, email_1.sendWelcomeEmail)(newUser.name, newUser.email);
                const response = yield (0, user_services_1.createUser)(newUser);
                userId = response._id.toString();
                user = response;
            }
            else {
                userId = user._id.toString();
            }
            const emailToken = jsonwebtoken_1.default.sign({ userId }, secret_1.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            yield (0, email_1.sendSignInEmail)(user.email, user.name, req.headers["user-agent"], emailToken);
            res
                .status(200)
                .json(new api_response_handling_1.default(200, "A verification email has been sent. Please check your inbox to complete sign-in.", true));
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
                return next(new api_error_handling_1.default(400, "Validation failed", messages));
            }
            console.log("Error: ", error);
            return next(new api_error_handling_1.default(500, "Unexprected error occured", error));
        }
    });
}
function generateAuthToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, secret_1.env.JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.query.token;
        const existingToken = yield (0, blockjwt_service_1.findBlockedJWT)(token);
        if (!token || typeof token !== "string" || (existingToken === null || existingToken === void 0 ? void 0 : existingToken.jwt) === token) {
            return next(new api_error_handling_1.default(400, "Invalid Token"));
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, secret_1.env.JWT_SECRET);
            const user = yield (0, user_services_1.getUserById)(new mongoose_1.default.Types.ObjectId(payload.userId));
            if (!user)
                return next(new api_error_handling_1.default(400, "User not found"));
            yield new Promise((resolve, reject) => {
                req.logIn(user, function (error) {
                    if (error)
                        return reject(new api_error_handling_1.default(500, "Login failed", [error.message]));
                    return resolve();
                });
            });
            yield (0, blockjwt_service_1.blockJWT)(token);
            const authToken = generateAuthToken(user._id);
            if (isNativeRequest(req)) {
                // For Capacitor native, redirect to deep link so App can capture token via appUrlOpen
                return res.redirect(`capacitor://localhost/dashboard?token=${authToken}`);
            }
            res.redirect(`${secret_1.env.CLIENT_URL}/dashboard?token=${authToken}`);
        }
        catch (error) {
            return next(new api_error_handling_1.default(400, "Invalid Token or Expired", [error.message]));
        }
    });
}
/**
 * req.logout() logs the user out of Passport's internal state.
 * req.session.destroy() deletes their session from the session store.
 * res.clearCookie() deletes the session cookie on the client.
 */
function logoutUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Also block JWT if provided (native apps use JWT, not cookies)
            const authHeader = req.headers.authorization;
            if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                try {
                    yield (0, blockjwt_service_1.blockJWT)(token);
                }
                catch (_) {
                    // ignore block errors
                }
            }
            if (req.session) {
                req.session.destroy((error) => {
                    if (error) {
                        return next(new api_error_handling_1.default(500, "Failed to destroy session", [error.message]));
                    }
                    res.clearCookie("connect.sid", { path: "/" });
                    return res
                        .status(200)
                        .json(new api_response_handling_1.default(200, "User logged out successfully"));
                });
            }
            else {
                res.clearCookie("connect.sid", { path: "/" });
                return res
                    .status(200)
                    .json(new api_response_handling_1.default(200, "User logged out successfully"));
            }
        }
        catch (error) {
            return next(error instanceof api_error_handling_1.default
                ? error
                : new api_error_handling_1.default(500, "Unexpcted error during logout", error));
        }
    });
}
function googleOAuthCallback(req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.redirect(`${secret_1.env.CLIENT_URL}/signin`);
        }
        const authToken = generateAuthToken(req.user._id);
        if (isNativeRequest(req)) {
            return res.redirect(`capacitor://localhost/dashboard?token=${authToken}`);
        }
        return res.redirect(`${secret_1.env.CLIENT_URL}/dashboard?token=${authToken}`);
    });
}
function githubOAuthCallback(req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.redirect(`${secret_1.env.CLIENT_URL}/signin`);
        }
        const authToken = generateAuthToken(req.user._id);
        if (isNativeRequest(req)) {
            return res.redirect(`capacitor://localhost/dashboard?token=${authToken}`);
        }
        return res.redirect(`${secret_1.env.CLIENT_URL}/dashboard?token=${authToken}`);
    });
}
function googleOAuth(_req, res) {
    res.status(200).json(new api_response_handling_1.default(200, "User Signin with Google", true));
}
function githubOAuth(_req, res) {
    res.status(200).json(new api_response_handling_1.default(200, "User Signin with Github", true));
}
