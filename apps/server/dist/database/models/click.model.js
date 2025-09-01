"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ClickSchema = new mongoose_1.default.Schema({
    short_url: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    click_cnt: {
        type: Number,
        required: true,
    },
    device: [
        {
            device_name: {
                type: String,
                required: true,
            },
            count: {
                type: Number,
                required: true,
            },
        },
    ],
    country: [
        {
            country_name: {
                type: String,
                required: true,
            },
            count: {
                type: Number,
                required: true,
            },
        },
    ],
    os: [
        {
            os_name: {
                type: String,
                required: true,
            },
            count: {
                type: Number,
                required: true,
            },
        },
    ],
    browser: [
        {
            browser_name: {
                type: String,
                required: true,
            },
            count: {
                type: Number,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
const Click = mongoose_1.default.model("Click", ClickSchema);
exports.default = Click;
