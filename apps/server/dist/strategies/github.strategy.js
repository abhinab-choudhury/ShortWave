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
const passport_github2_1 = require("passport-github2");
const secret_1 = require("../utils/secret");
const user_services_1 = require("../services/user.services");
const email_1 = require("../utils/email");
passport_1.default.use("github-strategy", new passport_github2_1.Strategy({
    clientID: secret_1.env.GITHUB_CLIENT_ID,
    clientSecret: secret_1.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${secret_1.env.SERVER_URL}/api/v1/auth/github/callback`,
    scope: ["read:user", "user:email"],
}, function (_accessToken, _refeshToken, profile, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        try {
            const user = yield (0, user_services_1.getUserByAuthProviderId)(profile.id);
            if (user) {
                user.name = profile.displayName || user.name;
                user.profilePic = ((_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || user.profilePic;
                yield user.save();
                return cb(null, user);
            }
            const email = (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
            if (!email) {
                return cb(new Error("Github account has no email associated"), false);
            }
            let existingUser = yield (0, user_services_1.getUserByEmail)(email);
            if (existingUser) {
                if (!existingUser.authProviders.some((p) => p.provider === "github")) {
                    existingUser.authProviders.push({
                        provider: "github",
                        providerId: profile.id,
                    });
                }
                existingUser.name = profile.displayName || existingUser.name;
                existingUser.profilePic =
                    ((_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value) || existingUser.profilePic;
                yield existingUser.save();
                return cb(null, existingUser);
            }
            const newUser = {
                email: (_h = (_g = profile.emails) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.value,
                authProviders: [
                    {
                        provider: "github",
                        providerId: profile.id,
                    },
                ],
                name: profile.displayName,
                profilePic: (_k = (_j = profile.photos) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.value,
                admin: false,
            };
            const response = yield (0, user_services_1.createUser)(newUser);
            yield (0, email_1.sendWelcomeEmail)(response === null || response === void 0 ? void 0 : response.name, response === null || response === void 0 ? void 0 : response.email);
            cb(null, response);
        }
        catch (error) {
            cb(error, false);
        }
    });
}));
