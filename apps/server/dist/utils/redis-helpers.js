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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLAIM_BATCH = void 0;
exports.getDeviceFingerprint = getDeviceFingerprint;
exports.recordClickInBuffer = recordClickInBuffer;
exports.flushRedishStatsToMongo = flushRedishStatsToMongo;
exports.flushBatches = flushBatches;
const redis_connect_1 = require("../database/redis-connect");
const crypto_1 = __importDefault(require("crypto"));
const click_service_1 = require("../services/click.service");
const db_connect_1 = __importDefault(require("../database/db-connect"));
const redis_connect_2 = require("../database/redis-connect");
const parse_ua_1 = require("./parse-ua");
/** A stuck Redis must not keep the function open: the click is dropped instead. */
function withTimeout(promise, ms) {
    let timer;
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
        }),
    ]).finally(() => clearTimeout(timer));
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
 * Buffers one click in Redis. The scheduled cron moves the buffer over to Mongo,
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
            // Deduplication and all counters must be atomic with respect to a flush.
            // Unflushed stats have no TTL: a missed cron must not erase clicks.
            yield redis_connect_1.redisClient.eval(`
      if not redis.call('SET', KEYS[1], '1', 'EX', ARGV[1], 'NX') then return 0 end
      redis.call('HINCRBY', KEYS[2], 'hits', 1)
      for i = 3, 6 do redis.call('HINCRBY', KEYS[2], ARGV[i], 1) end
      redis.call('HSET', KEYS[2], 'last_access', ARGV[2])
      redis.call('PERSIST', KEYS[2])
      return 1
    `, {
                keys: [hitKey, statsKey],
                arguments: [
                    String(ttl),
                    timeStamp,
                    `country:${country}`,
                    `os:${osType}`,
                    `device:${deviceType}`,
                    `browser:${browserType}`,
                ],
            });
        }
        catch (redisErr) {
            console.error("[Redis Error]", redisErr);
        }
    });
}
// Atomically detach a complete buffer. New clicks recreate the live key.
exports.CLAIM_BATCH = `
  if redis.call('EXISTS', KEYS[1]) == 0 then return 0 end
  redis.call('RENAME', KEYS[1], KEYS[2])
  redis.call('PERSIST', KEYS[2])
  return 1
`;
function flushRedishStatsToMongo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = process.env.CRON_SECRET;
        if (!secret)
            return res.status(503).json({ message: "CRON_SECRET is not configured" });
        const supplied = Buffer.from(req.get("authorization") || "");
        const expected = Buffer.from(`Bearer ${secret}`);
        if (supplied.length !== expected.length ||
            !crypto_1.default.timingSafeEqual(supplied, expected)) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const result = yield withTimeout(flushBatches(), 25000);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("[Analytics sync failed]", error);
            return res
                .status(503)
                .json({ message: "Analytics sync unavailable; retry later" });
        }
    });
}
function flushBatches() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        yield Promise.all([(0, db_connect_1.default)(), (0, redis_connect_2.REDIS_CONNECT)()]);
        const deadline = Date.now() + 15000;
        let processed = 0;
        // Retry detached batches before claiming new ones. SCAN avoids blocking Redis.
        for (const pattern of ["analytics_pending:*", "url_stats:*"]) {
            try {
                for (var _d = true, _e = (e_1 = void 0, __asyncValues(redis_connect_1.redisClient.scanIterator({
                    MATCH: pattern,
                    COUNT: 50,
                }))), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const keys = _c;
                    for (const key of keys) {
                        if (processed >= 50 || Date.now() >= deadline) {
                            return {
                                processed,
                                message: "Batch limit reached; remaining data retained",
                            };
                        }
                        const [, shortCode, date] = key.split(":");
                        if (!shortCode || !date)
                            continue;
                        let batchKey = key;
                        if (pattern === "url_stats:*") {
                            batchKey = `analytics_pending:${shortCode}:${date}:${crypto_1.default.randomUUID()}`;
                            const claimed = yield redis_connect_1.redisClient.eval(exports.CLAIM_BATCH, {
                                keys: [key, batchKey],
                                arguments: [],
                            });
                            if (!claimed)
                                continue;
                        }
                        const data = yield redis_connect_1.redisClient.hGetAll(batchKey);
                        if (Object.keys(data).length === 0)
                            continue;
                        yield persistBatch(shortCode, date, batchKey, data);
                        // A Mongo receipt makes retry safe even if this delete fails.
                        yield redis_connect_1.redisClient.del(batchKey);
                        processed++;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return {
            processed,
            message: processed ? "Analytics synced" : "No stats found",
        };
    });
}
function persistBatch(shortCode, date, batchKey, data) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield (0, click_service_1.createClick)(clickData, batchKey);
    });
}
