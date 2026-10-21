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
exports.handleRedirect = handleRedirect;
const functions_1 = require("@vercel/functions");
const url_services_1 = require("../services/url.services");
const api_error_handling_1 = __importDefault(require("../utils/api-error-handling"));
const redis_helpers_1 = require("../utils/redis-helpers");
/**
 * @desc   Redirect handler with analytics
 * @route  GET /:shortCode
 */
function handleRedirect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === "POST") {
            return next(new api_error_handling_1.default(405, "POST method not allowed"));
        }
        const shortCode = req.params.shortCode;
        if (!shortCode) {
            return next(new api_error_handling_1.default(400, "ShortCode Not Provided"));
        }
        try {
            const longUrl = yield (0, url_services_1.getLongUrlHandler)(shortCode.toString());
            if (!longUrl) {
                return next(new api_error_handling_1.default(404, "Short URL Not Found"));
            }
            console.log(`[Redirect] ${shortCode} → ${longUrl}`);
            // 302 (not 301): the browser has to come back for every visit, otherwise
            // the clicks would be cached and the analytics would stay empty.
            res.redirect(302, longUrl);
            // Count the click only after the response is on the wire: the analytics
            // write must never add latency to the redirect. waitUntil keeps the
            // function alive until the write is done.
            const clickWrite = (0, redis_helpers_1.recordClickInBuffer)(req, shortCode).catch((error) => console.error("[Click] failed to record:", error));
            (0, functions_1.waitUntil)(clickWrite);
            yield clickWrite;
        }
        catch (error) {
            console.error("[Redirect Error]", error);
            return next(new api_error_handling_1.default(500, "Internal Server Error", error));
        }
    });
}
