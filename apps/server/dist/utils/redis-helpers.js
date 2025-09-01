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
exports.flushRedishStatsToMongo = flushRedishStatsToMongo;
const redis_connect_1 = require("../database/redis-connect");
const crypto_1 = __importDefault(require("crypto"));
const click_service_1 = require("../services/click.service");
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
function flushRedishStatsToMongo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const url_stats_keys = yield redis_connect_1.redisClient.keys("url_stats:*");
        if (url_stats_keys.length === 0) {
            return res.status(200).json({ message: "No stats found" });
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
            }
        }
        // cleanup (after all keys processed)
        if (url_stats_keys.length > 0) {
            yield redis_connect_1.redisClient.del(url_stats_keys);
        }
        console.log(`Flushed and deleted Redis keys`);
        return res.status(200).json({ message: "CRON hit and data flushed" });
    });
}
