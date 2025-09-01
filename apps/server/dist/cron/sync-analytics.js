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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const redis_helpers_1 = require("../utils/redis-helpers");
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, redis_helpers_1.flushRedishStatsToMongo)(req, res);
            return res.status(200).json({ message: "Analytics synced to MongoDB" });
        }
        catch (error) {
            console.error("Error in sync-alaytics: ", error);
            return res.status(500).json({ error: "Sync Failed" });
        }
    });
}
