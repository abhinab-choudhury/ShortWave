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
exports.getAllUserCampaigns = getAllUserCampaigns;
exports.createUserCampaign = createUserCampaign;
exports.updateUserCampaign = updateUserCampaign;
exports.deleteUserCampaign = deleteUserCampaign;
exports.getUserCampaignStats = getUserCampaignStats;
exports.getUsersRecentCampaigns = getUsersRecentCampaigns;
const campaign_service_1 = require("../services/campaign.service");
const zod_1 = require("zod");
const api_response_handling_1 = __importDefault(require("../utils/api-response-handling"));
const api_error_handling_1 = __importStar(require("../utils/api-error-handling"));
const campaignSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(5, "Name should contain at least 5 characters")
        .max(20, "Name can contain at most 20 characters"),
    description: zod_1.z
        .string()
        .min(10, "Description shoould be at least 10 characters"),
});
/**
 * @desc    Get all campaigns
 * @route   GET /api/v1/campaign
 * @access  Authenticated
 */
function getAllUserCampaigns(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const campaigns = yield (0, campaign_service_1.getAllCampaigns)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            res
                .status(200)
                .json(new api_response_handling_1.default(200, "All Campaigns", true, campaigns));
        }
        catch (error) {
            return next((0, api_error_handling_1.normalizeError)(error, "Unexpected error occurred while fetching campaigns"));
        }
    });
}
/**
 * @desc    Create a new campaign
 * @route   POST /api/v1/campaign
 * @access  Authenticated
 */
function createUserCampaign(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const parsed = campaignSchema.safeParse(req.body);
        if (!parsed.success) {
            const messages = parsed.error.issues.map((issue) => issue.message);
            return next(new api_error_handling_1.default(400, "Validation Failed", messages));
        }
        try {
            const data = {
                name: parsed.data.name,
                description: parsed.data.description,
                user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            };
            const newCampaign = yield (0, campaign_service_1.createCampaign)(data);
            res
                .status(201)
                .json(new api_response_handling_1.default(201, "New campaign created successfully.", true, newCampaign));
        }
        catch (error) {
            return next((0, api_error_handling_1.normalizeError)(error, "Unexpected error occurred while creating a new campaign"));
        }
    });
}
/**
 * @desc    Update an existing campaign
 * @route   PATCH /api/v1/campaign/:id
 * @access  Authenticated
 */
function updateUserCampaign(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { campaignId } = req.params;
            const parsed = campaignSchema.safeParse(req.body);
            if (!parsed.success) {
                const messages = parsed.error.issues.map((issue) => issue.message);
                return next(new api_error_handling_1.default(400, "Validation Failed", messages));
            }
            const data = {
                name: parsed.data.name,
                description: parsed.data.description,
            };
            const updatedCampaign = yield (0, campaign_service_1.updateCampaign)(campaignId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, data);
            res
                .status(200)
                .json(new api_response_handling_1.default(200, "Campaign updated successfully", true, updatedCampaign));
        }
        catch (error) {
            return next((0, api_error_handling_1.normalizeError)(error, "Unexpected error occurred while updating the campaign"));
        }
    });
}
/**
 * @desc    Delete a campaign by ID
 * @route   DELETE /api/v1/campaign/:id
 * @access  Authenticated
 */
function deleteUserCampaign(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { campaignId } = req.params;
        (0, campaign_service_1.deleteCampaign)(campaignId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)
            .then(() => {
            res
                .status(200)
                .json(new api_response_handling_1.default(200, "Campaign deleted successfully", true));
        })
            .catch((error) => {
            return next((0, api_error_handling_1.normalizeError)(error, "Unexpected error occurred while deleting the campaign"));
        });
    });
}
/**
 * @desc    Get overall campaign statistics for the user
 * @route   GET /api/v1/campaign/stats
 * @access  Authenticated
 */
function getUserCampaignStats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { total_links, crg, active_links } = yield (0, campaign_service_1.getCampaignStats)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            res.status(200).json(new api_response_handling_1.default(200, "Campaign Stats", true, {
                total_links,
                crg,
                active_links,
            }));
        }
        catch (error) {
            return next((0, api_error_handling_1.normalizeError)(error, "Unexpected error occurred while fetching campaign statistics"));
        }
    });
}
/**
 * @desc    Get the most recent campaigns created by the user
 * @route   GET /api/v1/campaign/recent
 * @access  Authenticated
 */
function getUsersRecentCampaigns(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const links = yield (0, campaign_service_1.getRecentCampaigns)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            res
                .status(200)
                .json(new api_response_handling_1.default(200, "Recent Campaigns", true, { links }));
        }
        catch (error) {
            return next((0, api_error_handling_1.normalizeError)(error, "Unexpected error occurred while getting recent campaigns"));
        }
    });
}
