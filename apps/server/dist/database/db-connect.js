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
exports.MONGODB_URI = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const secret_1 = require("../utils/secret");
exports.MONGODB_URI = `${secret_1.env.MONGODB_BASE_URI}/${secret_1.env.DATABASE_NAME}?retryWrites=true`;
// Don't buffer commands if not connected (prevents hanging requests on cold start)
mongoose_1.default.set("bufferCommands", false);
// One pool per warm instance, reused by every request. A client per request would
// pay a fresh TCP + TLS handshake on every redirect.
let connectionPromise = null;
const DB_CONNECT = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!connectionPromise) {
        connectionPromise = mongoose_1.default
            .connect(exports.MONGODB_URI, {
            maxPoolSize: 5, // serverless: Mongoose defaults to 100 sockets per instance
            minPoolSize: 1,
            maxIdleTimeMS: 60000,
            serverSelectionTimeoutMS: 10000, // a cold instance needs a few seconds
            connectTimeoutMS: 10000,
        })
            .then((m) => {
            console.log("Connection to DB successfully", m.connection.port);
            return m.connection;
        })
            .catch((error) => {
            connectionPromise = null; // let the next invocation retry
            throw error;
        });
    }
    return connectionPromise;
});
exports.default = DB_CONNECT;
