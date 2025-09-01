"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UrlSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    campaign_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    original_url: {
        type: String,
        required: true,
        trim: true,
    },
    short_url: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    from_date: {
        type: Date,
        required: false,
    },
    to_date: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
});
const Url = mongoose_1.default.model("Url", UrlSchema);
exports.default = Url;
