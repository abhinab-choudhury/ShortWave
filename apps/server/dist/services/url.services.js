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
exports.createCampaignUrl = createCampaignUrl;
exports.getLongUrl = getLongUrl;
exports.getLongUrlHandler = getLongUrlHandler;
exports.deleteUrl = deleteUrl;
exports.getAllCampaignUrlsClick = getAllCampaignUrlsClick;
exports.getTotalLinkCnt = getTotalLinkCnt;
exports.getActiveLinkCnt = getActiveLinkCnt;
const mongoose_1 = __importDefault(require("mongoose"));
const url_model_1 = __importDefault(require("../database/models/url.model"));
const redis_connect_1 = require("../database/redis-connect");
const campaign_model_1 = __importDefault(require("../database/models/campaign.model"));
const click_model_1 = __importDefault(require("../database/models/click.model"));
/* Create a new URL in DB */
function createCampaignUrl(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new url_model_1.default(data);
        return yield url.save();
    });
}
function getLongUrl(short_url) {
    return __awaiter(this, void 0, void 0, function* () {
        const longUrl = yield url_model_1.default.findOne({ short_url })
            .select("original_url")
            .lean();
        return longUrl === null || longUrl === void 0 ? void 0 : longUrl.original_url;
    });
}
/* Gets the Long/Original URL for the short-url(uses redis for cacheing) */
function getLongUrlHandler(short_url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (redis_connect_1.redisClient.isReady) {
            try {
                const cachedUrl = yield redis_connect_1.redisClient.get(short_url);
                if (cachedUrl) {
                    console.log(`CACHE HIT for: ${short_url}`);
                    return cachedUrl; // ✅ Cache Hit
                }
            }
            catch (error) {
                console.error("Error reading from Redis:", error);
            }
        }
        console.log(`CACHE MISS for: ${short_url}. Querying DB...`);
        const urlFromDb = yield getLongUrl(short_url);
        if (urlFromDb && redis_connect_1.redisClient.isReady) {
            try {
                yield redis_connect_1.redisClient.set(short_url, urlFromDb, {
                    expiration: {
                        type: "EX",
                        value: 3600,
                    },
                }); // ✅ Cache Population
            }
            catch (error) {
                console.error("Failed to write to Redis cache:", error);
            }
        }
        return urlFromDb;
    });
}
/**
 * get all the links which are created by the user
 * over all the campaigns
 * */
function getAllUrl(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield url_model_1.default.find({ user_id: userId });
    });
}
/* delete a specific url from a campaign by the help of short_url */
function deleteUrl(userId, shortUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteUrlSession = yield mongoose_1.default.startSession();
        deleteUrlSession.startTransaction();
        try {
            const urlDoc = yield url_model_1.default.findOne({
                short_url: shortUrl,
            }).session(deleteUrlSession);
            if (!urlDoc) {
                throw new Error("URL not found or not authorized");
            }
            yield url_model_1.default.deleteOne({ short_url: urlDoc.short_url }).session(deleteUrlSession);
            yield click_model_1.default.deleteMany({ short_url: urlDoc.short_url }).session(deleteUrlSession);
            yield deleteUrlSession.commitTransaction();
        }
        catch (error) {
            yield deleteUrlSession.abortTransaction();
            console.error("Error during url deletion: ", error);
            throw error;
        }
        finally {
            deleteUrlSession.endSession();
        }
    });
}
function getAllCampaignUrlsClick(campaignId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongoose_1.default.Types.ObjectId.isValid(campaignId)) {
            console.log("Invalid Campaign ID.");
            return null;
        }
        const result = yield campaign_model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(campaignId),
                },
            },
            {
                $lookup: {
                    from: "urls",
                    let: { campaign_id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$campaign_id", "$$campaign_id"] } } },
                        {
                            $lookup: {
                                from: "clicks",
                                localField: "short_url",
                                foreignField: "short_url",
                                as: "clicks",
                            },
                        },
                    ],
                    as: "urls",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    urls: {
                        short_url: 1,
                        original_url: 1,
                        createdAt: 1,
                        clicks: 1,
                    },
                },
            },
        ]);
        return result.length > 0 ? result[0] : null;
    });
}
/* get Count of URL which is created */
function getTotalLinkCnt(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield url_model_1.default.find({ user_id: userId }).countDocuments();
    });
}
/* get all active-link cnt */
function getActiveLinkCnt(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let activeLinkCnt = 0;
        const allLinks = yield getAllUrl(userId);
        const now = new Date();
        allLinks.forEach((link) => {
            const fromDate = link.from_date;
            const toDate = link.to_date;
            if ((!fromDate || now >= fromDate) && (!toDate || now <= toDate))
                activeLinkCnt++;
        });
        return activeLinkCnt;
    });
}
