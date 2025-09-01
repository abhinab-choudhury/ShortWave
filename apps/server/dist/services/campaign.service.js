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
exports.getAllCampaigns = getAllCampaigns;
exports.createCampaign = createCampaign;
exports.getCampaignById = getCampaignById;
exports.updateCampaign = updateCampaign;
exports.deleteCampaign = deleteCampaign;
exports.getRecentCampaigns = getRecentCampaigns;
exports.getCampaignStats = getCampaignStats;
const mongoose_1 = __importDefault(require("mongoose"));
const campaign_model_1 = __importDefault(require("../database/models/campaign.model"));
const url_model_1 = __importDefault(require("../database/models/url.model"));
const click_model_1 = __importDefault(require("../database/models/click.model"));
const url_services_1 = require("./url.services");
const click_service_1 = require("./click.service");
/**
 * Fetch all campaigns for a specific user from the database
 */
function getAllCampaigns(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield campaign_model_1.default.find({ user_id: userId }).sort({ createdAt: -1 });
    });
}
/**
 * Create a new campaign in the database
 */
function createCampaign(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const campaign = new campaign_model_1.default(data);
        return yield campaign.save();
    });
}
/**
 * Fetch a single campaign by its ID
 */
function getCampaignById(campaignId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield campaign_model_1.default.findOne({ _id: campaignId, user: userId });
    });
}
/**
 * Update a campaign by ID
 * updates name of the campaign
 */
function updateCampaign(campaignId, userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield campaign_model_1.default.findOneAndUpdate({ _id: campaignId, user: userId }, data, { new: true });
    });
}
/**
 * Delete a campaign by ID
 */
function deleteCampaign(campaignId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteCampaignSession = yield mongoose_1.default.startSession();
        deleteCampaignSession.startTransaction();
        try {
            const urls = yield url_model_1.default.find({ campaign_id: campaignId }).session(deleteCampaignSession);
            const urlIds = urls.map((url) => url._id);
            yield click_model_1.default.deleteMany({ url_id: { $in: urlIds } }).session(deleteCampaignSession);
            yield url_model_1.default.deleteMany({ user_id: userId, campaign_id: campaignId }).session(deleteCampaignSession);
            const deleted = yield campaign_model_1.default.findByIdAndDelete(campaignId).session(deleteCampaignSession);
            yield deleteCampaignSession.commitTransaction();
            console.log("Campaign and all related data deleted successfully.\nDeleted: ", deleted);
        }
        catch (error) {
            yield deleteCampaignSession.abortTransaction();
            console.error("Error during campaign deletion:", error);
            throw error;
        }
        finally {
            deleteCampaignSession.endSession();
        }
    });
}
/**
 * Gets all the Campaigns in order of the last
 * updated campaign
 */
function getRecentCampaigns(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const recentCampaigns = yield campaign_model_1.default.find({ user_id: userId })
            .sort({ updatedAt: -1 })
            .limit(3);
        return recentCampaigns;
    });
}
/* Get Campaign Status for the all dashboard.  */
function getCampaignStats(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalLinkCnt = yield (0, url_services_1.getTotalLinkCnt)(userId);
        const cgrPercent = yield (0, click_service_1.getTotalCGRPercent)(userId);
        const activeLinkCnt = yield (0, url_services_1.getActiveLinkCnt)(userId);
        const stats = {
            total_links: totalLinkCnt,
            crg: cgrPercent,
            active_links: activeLinkCnt,
        };
        return stats;
    });
}
