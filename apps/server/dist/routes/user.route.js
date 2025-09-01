"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
/**
 * @route POST /api/v1/user/change-username
 * @dec Change the username of the logged in user
 * @access Private
 */
router.post("/change-username", auth_middleware_1.isAuthenticated, user_controller_1.changeUsersUsername);
exports.default = router;
