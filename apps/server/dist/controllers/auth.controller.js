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
exports.me = me;
exports.signinUser = signinUser;
exports.verifyToken = verifyToken;
exports.logoutUser = logoutUser;
exports.googleOAuth = googleOAuth;
exports.githubOAuth = githubOAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_error_handling_1 = __importDefault(require("../utils/api-error-handling"));
const user_services_1 = require("../services/user.services");
const zod_1 = require("zod");
const email_1 = require("../utils/email");
const secret_1 = require("../utils/secret");
const blockjwt_service_1 = require("../services/blockjwt.service");
const api_response_handling_1 = __importDefault(require("../utils/api-response-handling"));
const signinReqSchema = zod_1.z.object({
    email: zod_1.z.string().email().trim(),
});
function me(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) {
            res.status(200).json(new api_response_handling_1.default(200, "User Authenticated", true, {
                user: {
                    userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                    email: (_c = req.user) === null || _c === void 0 ? void 0 : _c.email,
                    name: (_d = req.user) === null || _d === void 0 ? void 0 : _d.name,
                    profilePic: (_e = req.user) === null || _e === void 0 ? void 0 : _e.profilePic,
                },
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
            let userId = user === null || user === void 0 ? void 0 : user._id;
            if (!user) {
                const newUser = {
                    email: parsedReq.email,
                    name: (_a = parsedReq.email.split("@")) === null || _a === void 0 ? void 0 : _a[0],
                    admin: false,
                };
                yield (0, email_1.sendWelcomeEmail)(newUser.name, newUser.email);
                const response = yield (0, user_services_1.createUser)(newUser);
                userId = response._id;
                user = response;
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
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.query.token;
        const existingToken = yield (0, blockjwt_service_1.findBlockedJWT)(token);
        if (!token || typeof token !== "string" || (existingToken === null || existingToken === void 0 ? void 0 : existingToken.jwt) === token) {
            return next(new api_error_handling_1.default(400, "Invalid Token"));
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, secret_1.env.JWT_SECRET);
            const user = yield (0, user_services_1.getUserById)(payload.userId);
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
            res.redirect(`${secret_1.env.CLIENT_URL}/dashboard`);
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
            req.session.destroy((error) => {
                if (error) {
                    return next(new api_error_handling_1.default(500, "Failed to destroy session", [error.messaege]));
                }
                res.clearCookie("connect.sid");
                return res
                    .status(200)
                    .json(new api_response_handling_1.default(200, "User logged out successfully"));
            });
        }
        catch (error) {
            return next(error instanceof api_error_handling_1.default
                ? error
                : new api_error_handling_1.default(500, "Unexpcted error during logout", error));
        }
    });
}
function googleOAuth(_req, res) {
    res.status(200).json(new api_response_handling_1.default(200, "User Signin with Google", true));
}
function githubOAuth(_req, res) {
    res.status(200).json(new api_response_handling_1.default(200, "User Signin with Github", true));
}
