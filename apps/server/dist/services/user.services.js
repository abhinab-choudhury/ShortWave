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
exports.getUserByAuthProviderId = getUserByAuthProviderId;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.changeUsername = changeUsername;
const user_model_1 = __importDefault(require("../database/models/user.model"));
/*
 * Fetch User with a specific authProviderId from the database
 */
function getUserByAuthProviderId(authProviderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.default.findOne({
            authProviders: {
                $elemMatch: {
                    providerId: authProviderId,
                },
            },
        });
    });
}
/*
 * Fetch user by their id from the database
 */
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.default.findById(id);
    });
}
/*
 * Fetch user by their email from the database
 */
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.default.findOne({ email });
    });
}
/*
 * Creates a new user in the database
 */
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new user_model_1.default(data);
        return yield user.save();
    });
}
/*
 * Change username
 */
function changeUsername(userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.default.findByIdAndUpdate(userId, { name: data.name }, { new: true });
    });
}
