"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const url_controller_1 = require("../controllers/url.controller");
const router = express_1.default.Router();
/**
 * @route   GET /api/v1/url/:urlId
 * @desc    Get details of a specific short URL which includes analytics
 * @access  Authenticated
 */
router.get("/:urlId", auth_middleware_1.isAuthenticated, url_controller_1.getUserUrlDetails);
/**
 * @route   DELETE /api/v1/url/:shortLink
 * @desc    Delete a short URL
 * @access  Authenticated
 */
router.delete("/:shortLink", auth_middleware_1.isAuthenticated, url_controller_1.deleteUserUrl);
exports.default = router;
