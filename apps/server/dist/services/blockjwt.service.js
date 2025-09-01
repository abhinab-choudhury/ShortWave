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
exports.blockJWT = blockJWT;
exports.findBlockedJWT = findBlockedJWT;
const blockjwt_model_1 = __importDefault(require("../database/models/blockjwt.model"));
/**
 * Added the JWT Token to the block list after
 * beign used for once.
 * */
function blockJWT(jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = new blockjwt_model_1.default({
            jwt,
        });
        return yield response.save();
    });
}
/**
 * Finds the JWT token, if it is already
 * add to block-list, which means which, JWT Token
 * is already used.
 * */
function findBlockedJWT(jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield blockjwt_model_1.default.findOne({ jwt });
    });
}
