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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const secret_1 = require("../utils/secret");
const user_services_1 = require("../services/user.services");
const email_1 = require("../utils/email");
passport_1.default.use("google-strategy", new passport_google_oauth20_1.Strategy({
    clientID: secret_1.env.GOOGLE_CLIENT_ID,
    clientSecret: secret_1.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${secret_1.env.SERVER_URL}/api/v1/auth/google/callback`,
    scope: ["profile", "email"],
}, function (_accessToken, _refreshToken, profile, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            let user = yield (0, user_services_1.getUserByAuthProviderId)(profile.id);
            if (user) {
                user.name = profile.displayName || user.name;
                user.profilePic = ((_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || user.profilePic;
                yield user.save();
                return cb(null, user);
            }
            const email = (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
            if (!email) {
                return cb(new Error("Google account has no email associated"), false);
            }
            let existingUser = yield (0, user_services_1.getUserByEmail)(email); // implement this in services
            if (existingUser) {
                if (!existingUser.authProviders.some((p) => p.provider === "google")) {
                    existingUser.authProviders.push({
                        provider: "google",
                        providerId: profile.id,
                    });
                }
                existingUser.name = profile.displayName || existingUser.name;
                existingUser.profilePic =
                    ((_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value) || existingUser.profilePic;
                yield existingUser.save();
                return cb(null, existingUser);
            }
            let newUser = {
                email,
                authProviders: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
                name: profile.displayName,
                profilePic: (_h = (_g = profile.photos) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.value,
                admin: false,
            };
            let response = yield (0, user_services_1.createUser)(newUser);
            yield (0, email_1.sendWelcomeEmail)(response === null || response === void 0 ? void 0 : response.name, response === null || response === void 0 ? void 0 : response.email);
            return cb(null, response);
        }
        catch (error) {
            cb(error, false);
        }
    });
}));
