"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },
    authProviders: [
        {
            provider: {
                type: String,
                enum: ["google", "github"],
                required: true,
            },
            providerId: {
                type: String,
                required: true,
            },
        },
    ],
    name: {
        type: String,
        trim: true,
    },
    profilePic: {
        type: String,
        trim: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
