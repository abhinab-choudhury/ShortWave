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
exports.getDeviceFingerprint = getDeviceFingerprint;
exports.recordClickInBuffer = recordClickInBuffer;
exports.flushRedishStatsToMongo = flushRedishStatsToMongo;
const redis_connect_1 = require("../database/redis-connect");
const crypto_1 = __importDefault(require("crypto"));
const click_service_1 = require("../services/click.service");
const parse_ua_1 = require("./parse-ua");
/** A stuck Redis must not keep the function open: the click is dropped instead. */
function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)),
    ]);
}
function recordToArray(record, keyName, valueName) {
    return Object.entries(record).map(([k, v]) => {
        return {
            [keyName]: k,
            [valueName]: v,
        };
    });
}
function getDeviceFingerprint(req) {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const ua = req.headers["user-agent"] || "";
    const lang = req.headers["accept-language"] || "";
    const raw = `${ip}|${ua}|${lang}`;
    return crypto_1.default.createHash("sha256").update(raw).digest("hex");
}
/**
 * Buffers one click in Redis. The daily cron moves the buffer over to Mongo,
 * so the redirect itself never has to wait for a database write.
 */
function recordClickInBuffer(req, shortCode) {
    return withTimeout(bufferClick(req, shortCode), 3000);
}
function bufferClick(req, shortCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const ttl = 3600; // 1 hour TTL
        const timeStamp = Date.now().toString();
        const userAgent = req.get("user-agent") || "";
        const country = req.get("x-vercel-ip-country") || "unknown";
        const { device, os, browser } = (0, parse_ua_1.parseUserAgent)(userAgent);
        const deviceType = (device === null || device === void 0 ? void 0 : device.type) || "desktop";
        const osType = (os === null || os === void 0 ? void 0 : os.name) || "unknown";
        const browserType = (browser === null || browser === void 0 ? void 0 : browser.name) || "unknown";
        const fingerprint = getDeviceFingerprint(req);
        const hitKey = `device_hit:${shortCode}:${fingerprint}`;
        const statsKey = `url_stats:${shortCode}:${new Date().toISOString().split("T")[0]}`;
        try {
            // Set device fingerprint to prevent duplicate stats
            const isUniqueDevice = yield redis_connect_1.redisClient.set(hitKey, "1", {
                expiration: { type: "EX", value: ttl },
                condition: "NX",
            });
            // Only update stats for unique devices
            if (!isUniqueDevice)
                return;
            yield redis_connect_1.redisClient.hIncrBy(statsKey, "hits", 1);
            yield redis_connect_1.redisClient.hIncrBy(statsKey, `country:${country}`, 1);
            yield redis_connect_1.redisClient.hIncrBy(statsKey, `os:${osType}`, 1);
            yield redis_connect_1.redisClient.hIncrBy(statsKey, `device:${deviceType}`, 1);
            yield redis_connect_1.redisClient.hIncrBy(statsKey, `browser:${browserType}`, 1);
            yield redis_connect_1.redisClient.hSet(statsKey, "last_access", timeStamp);
            // update the expire as per the latest entry.
            yield redis_connect_1.redisClient.expire(statsKey, ttl);
        }
        catch (redisErr) {
            console.error("[Redis Error]", redisErr);
        }
    });
}
function flushRedishStatsToMongo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const url_stats_keys = yield redis_connect_1.redisClient.keys("url_stats:*");
        if (url_stats_keys.length === 0) {
            return res.status(200).json({ status: 200, message: "No stats found" });
        }
        for (const key of url_stats_keys) {
            const data = yield redis_connect_1.redisClient.hGetAll(key);
            if (!data || Object.keys(data).length === 0) {
                continue;
            }
            const [, shortCode, date] = key.split(":");
            if (!shortCode || !date) {
                console.warn(`Skipping invalid Redis key: ${key}`);
                continue;
            }
            const clickCount = parseInt(data.hits || "0", 10);
            const country = {};
            const os = {};
            const device = {};
            const browser = {};
            for (const [field, value] of Object.entries(data)) {
                if (field.startsWith("country:")) {
                    country[field.split(":")[1]] = parseInt(value, 10);
                }
                else if (field.startsWith("os:")) {
                    os[field.split(":")[1]] = parseInt(value, 10);
                }
                else if (field.startsWith("device:")) {
                    device[field.split(":")[1]] = parseInt(value, 10);
                }
                else if (field.startsWith("browser:")) {
                    browser[field.split(":")[1]] = parseInt(value, 10);
                }
            }
            const clickData = {
                short_url: shortCode,
                click_cnt: clickCount,
                date: date,
                device: recordToArray(device, "device_name", "count"),
                country: recordToArray(country, "country_name", "count"),
                os: recordToArray(os, "os_name", "count"),
                browser: recordToArray(browser, "browser_name", "count"),
            };
            try {
                yield (0, click_service_1.createClick)(clickData);
            }
            catch (error) {
                console.error("Error during MongoDB insert:", error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            }
        }
        // cleanup (after all keys processed)
        if (url_stats_keys.length > 0) {
            yield redis_connect_1.redisClient.del(url_stats_keys);
        }
        console.log(`Flushed and deleted Redis keys`);
        return res.status(200).json({ status: 200, message: "CRON hit and data flushed" });
    });
}
