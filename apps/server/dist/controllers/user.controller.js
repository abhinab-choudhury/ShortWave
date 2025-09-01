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
exports.changeUsersUsername = changeUsersUsername;
const api_response_handling_1 = __importDefault(require("../utils/api-response-handling"));
const api_error_handling_1 = __importDefault(require("../utils/api-error-handling"));
const user_services_1 = require("../services/user.services");
function changeUsersUsername(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const data = req.body;
            if (data.username.trim()) {
                const newUser = yield (0, user_services_1.changeUsername)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
                    name: data.username.trim(),
                });
                res
                    .status(200)
                    .json(new api_response_handling_1.default(200, "Username updated successfully.", true, newUser));
            }
        }
        catch (error) {
            console.log("Error: ", error);
            return next(new api_error_handling_1.default(400, "Failed to change the username"));
        }
    });
}
