"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blockJWTSchema = new mongoose_1.default.Schema({
    jwt: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const BlockJWT = mongoose_1.default.model("BlockJWT", blockJWTSchema);
exports.default = BlockJWT;
