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
exports.getClickById = getClickById;
exports.createClick = createClick;
exports.getTotalCGRPercent = getTotalCGRPercent;
const click_model_1 = __importDefault(require("../database/models/click.model"));
const url_model_1 = __importDefault(require("../database/models/url.model"));
const mongoose_1 = __importDefault(require("mongoose"));
function getClickById(urlId) {
    return __awaiter(this, void 0, void 0, function* () {
        const requiredUrl = yield click_model_1.default.findById(urlId);
        return requiredUrl;
    });
}
function increaseOrPushArrayField(session, short_url, date, field, key, value, count) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const incResult = yield click_model_1.default.updateOne({
                short_url,
                date,
                [`${field}.${key}`]: value,
            }, {
                $inc: {
                    [`${field}.$.count`]: count,
                },
            }, { session });
            if (incResult.modifiedCount === 0) {
                yield click_model_1.default.updateOne({ short_url, date }, {
                    $push: {
                        [field]: {
                            [key]: value,
                            count,
                        },
                    },
                }, { session });
            }
        }
        catch (error) {
            console.error(`Error updating ${field}=${value}:`, error);
            throw error;
        }
    });
}
function createClick(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield mongoose_1.default.startSession();
        try {
            yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                yield click_model_1.default.updateOne({ short_url: data.short_url, date: data.date }, {
                    $inc: { click_cnt: data.click_cnt },
                }, { upsert: true, session });
                for (const d of data.device) {
                    yield increaseOrPushArrayField(session, data.short_url, data.date, "device", "device_name", d.device_name, d.count);
                }
                for (const o of data.os) {
                    yield increaseOrPushArrayField(session, data.short_url, data.date, "os", "os_name", o.os_name, o.count);
                }
                for (const b of data.browser) {
                    yield increaseOrPushArrayField(session, data.short_url, data.date, "browser", "browser_name", b.browser_name, b.count);
                }
                for (const c of data.country) {
                    yield increaseOrPushArrayField(session, data.short_url, data.date, "country", "country_name", c.country_name, c.count);
                }
            }));
        }
        catch (error) {
            console.error("Error while creating/updating click:", error);
            throw new Error("Failed to update click stats");
        }
        finally {
            yield session.endSession();
        }
    });
}
function getTotalCGRPercent(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const userUrls = yield url_model_1.default.find({ user_id: userId }).select("short_url");
        const shortUrls = userUrls.map((u) => u.short_url);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);
        const currentDayClicks = yield click_model_1.default.aggregate([
            {
                $match: {
                    short_url: { $in: shortUrls },
                    date: yesterday.toISOString().split("T")[0],
                },
            },
            { $group: { _id: null, total: { $sum: "$click_cnt" } } },
        ]);
        const previousDayClicks = yield click_model_1.default.aggregate([
            {
                $match: {
                    short_url: { $in: shortUrls },
                    date: twoDaysAgo.toISOString().split("T")[0],
                },
            },
            { $group: { _id: null, total: { $sum: "$click_cnt" } } },
        ]);
        const current = ((_a = currentDayClicks[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const previous = ((_b = previousDayClicks[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
        console.log("current: ", current);
        console.log("previous: ", previous);
        if (previous === 0) {
            return current > 0 ? "100%" : "0%";
        }
        const cgr = ((current - previous) / previous) * 100;
        return `${cgr.toFixed(2)}%`;
    });
}
