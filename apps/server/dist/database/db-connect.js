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
const DB_CONNECT = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connectionInstance = yield mongoose_1.default.connect(exports.MONGODB_URI);
        console.log("Connection to DB successfully", connectionInstance.connection.port);
        return connectionInstance.connection;
    }
    catch (error) {
        console.log("MongoDB Connection Error :", error);
        process.exit(1);
    }
});
exports.default = DB_CONNECT;
