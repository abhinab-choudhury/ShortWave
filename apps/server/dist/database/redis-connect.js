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
exports.REDIS_CONNECT = exports.redisClient = void 0;
const redis_1 = require("redis");
const secret_1 = require("../utils/secret");
const redisClient = (0, redis_1.createClient)({
    url: secret_1.env.REDIS_URL,
});
exports.redisClient = redisClient;
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Successfully connected to Redis."));
redisClient.on("reconnecting", () => console.log("Reconnecting to Redis..."));
const REDIS_CONNECT = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
    }
    catch (error) {
        console.error("Redis Connection Error: ", error);
        process.exit(1);
    }
});
exports.REDIS_CONNECT = REDIS_CONNECT;
