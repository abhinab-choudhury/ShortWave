"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getUserUrlDetails = getUserUrlDetails;
exports.deleteUserUrl = deleteUserUrl;
exports.createUserUrl = createUserUrl;
exports.getUserUrlsBycampaign = getUserUrlsBycampaign;
const zod_1 = __importDefault(require("zod"));
const sha256_1 = __importDefault(require("sha256"));
const api_error_handling_1 = __importStar(require("../utils/api-error-handling"));
const url_services_1 = require("../services/url.services");
const api_response_handling_1 = __importDefault(require("../utils/api-response-handling"));
const mongoose_1 = require("mongoose");
const urlSchema = zod_1.default.object({
    url: zod_1.default.string().url(),
    to_date: zod_1.default.date().optional(),
    from_date: zod_1.default.date().optional(),
});
/**
 * @desc    Get details of a specific short URL
 * @route   GET /api/v1/url/:urlId
 * @access  Authenticated
 */
function getUserUrlDetails() {
    return __awaiter(this, void 0, void 0, function* () { });
}
/**
 * @desc    Delete a short URL
 * @route   DELETE /api/v1/url/:urlId
 * @access  Authenticated
 */
function deleteUserUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { urlId } = req.params;
            yield (0, url_services_1.deleteUrl)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, urlId.toString());
            res
                .status(200)
                .json(new api_response_handling_1.default(200, "short-url deleted successfully", true));
        }
        catch (error) {
            return next((0, api_error_handling_1.normalizeError)(error, "Unexprected error occured while deleting the url"));
        }
    });
}
/**
 * @desc    Create a new short URL inside a campaign
 * @route   POST /api/v1/campaign/:campaignId/url
 * @access  Authenticated
 */
function createUserUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const parsed = urlSchema.safeParse(req.body);
        if (!parsed.success) {
            const message = parsed.error.issues.map((issue) => issue.message);
            return next(new api_error_handling_1.default(400, "Validation Failed", message));
        }
        try {
            const { campaignId } = req.params;
            let attempt = 0;
            let shortened_url;
            let longUrl;
            do {
                const stringToHash = parsed.data.url + (attempt > 0 ? attempt : "");
                shortened_url = (0, sha256_1.default)(stringToHash).slice(-6);
                longUrl = yield (0, url_services_1.getLongUrlHandler)(shortened_url);
                attempt++;
            } while (longUrl);
            const data = {
                user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                campaign_id: new mongoose_1.Types.ObjectId(campaignId.toString()),
                original_url: parsed.data.url,
                short_url: shortened_url,
                from_date: parsed.data.from_date,
                to_date: parsed.data.to_date,
            };
            const response = yield (0, url_services_1.createCampaignUrl)(data);
            res
                .status(201)
                .json(new api_response_handling_1.default(201, "New Shorterned URL created successfully.", true, response));
        }
        catch (err) {
            return next((0, api_error_handling_1.normalizeError)(err, "Unexpected error occured while creating a new url"));
        }
    });
}
/**
 * @desc    Get all URLs inside a campaign
 * @route   GET /api/v1/campaign/:campaignId/url
 * @access  Authenticated
 */
function getUserUrlsBycampaign(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { campaignId } = req.params;
            const campaignUrls = yield (0, url_services_1.getAllCampaignUrlsClick)(campaignId.toString());
            res
                .status(200)
                .json(new api_response_handling_1.default(200, "All Urls for the Campaign", true, campaignUrls));
        }
        catch (error) {
            return next((0, api_error_handling_1.normalizeError)(error, "Unexpected error occured while fetching campaigns"));
        }
    });
}
