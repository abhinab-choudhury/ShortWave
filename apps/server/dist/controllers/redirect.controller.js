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
exports.handleRedirect = handleRedirect;
const url_services_1 = require("../services/url.services");
const api_error_handling_1 = __importDefault(require("../utils/api-error-handling"));
const parse_ua_1 = require("../utils/parse-ua");
const redis_connect_1 = require("../database/redis-connect");
const redis_helpers_1 = require("../utils/redis-helpers");
/**
 * @desc   Redirect handler with analytics
 * @route  GET /:shortCode
 */
function handleRedirect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === "POST") {
            return next(new api_error_handling_1.default(405, "POST method not allowed"));
        }
        const { shortCode } = req.params;
        if (!shortCode) {
            return next(new api_error_handling_1.default(400, "ShortCode Not Provided"));
        }
        try {
            const longUrl = yield (0, url_services_1.getLongUrlHandler)(shortCode);
            if (!longUrl) {
                return next(new api_error_handling_1.default(404, "Short URL Not Found"));
            }
            const ttl = 3600; // 1 hour TTL
            const timeStamp = Date.now().toString();
            const userAgent = req.get("user-agent") || "";
            const country = req.get("x-vercel-ip-country") || "unknown";
            const { device, os, browser } = (0, parse_ua_1.parseUserAgent)(userAgent);
            const deviceType = (device === null || device === void 0 ? void 0 : device.type) || "desktop";
            const osType = (os === null || os === void 0 ? void 0 : os.name) || "unknown";
            const browserType = (browser === null || browser === void 0 ? void 0 : browser.name) || "unknown";
            const fingerprint = (0, redis_helpers_1.getDeviceFingerprint)(req);
            const hitKey = `device_hit:${shortCode}:${fingerprint}`;
            const statsKey = `url_stats:${shortCode}:${new Date().toLocaleDateString().split("/").reverse().join("-")}`;
            try {
                // Set device fingerprint to prevent duplicate stats
                const isUniqueDevice = yield redis_connect_1.redisClient.set(hitKey, "1", {
                    expiration: { type: "EX", value: ttl },
                    condition: "NX",
                });
                // Only update stats for unique devices
                if (isUniqueDevice) {
                    yield redis_connect_1.redisClient.hIncrBy(statsKey, "hits", 1);
                    yield redis_connect_1.redisClient.hIncrBy(statsKey, `country:${country}`, 1);
                    yield redis_connect_1.redisClient.hIncrBy(statsKey, `os:${osType}`, 1);
                    yield redis_connect_1.redisClient.hIncrBy(statsKey, `device:${deviceType}`, 1);
                    yield redis_connect_1.redisClient.hIncrBy(statsKey, `browser:${browserType}`, 1);
                    yield redis_connect_1.redisClient.hSet(statsKey, "last_access", timeStamp);
                    // update the expire as per the latest entry.
                    yield redis_connect_1.redisClient.expire(statsKey, ttl);
                }
            }
            catch (redisErr) {
                console.error("[Redis Error]", redisErr);
            }
            console.log(`[Redirect] ${shortCode} → ${longUrl}`);
            return res.redirect(302, longUrl);
        }
        catch (error) {
            console.error("[Redirect Error]", error);
            return next(new api_error_handling_1.default(500, "Internal Server Error", error));
        }
    });
}
