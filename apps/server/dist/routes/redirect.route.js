"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redirect_controller_1 = require("../controllers/redirect.controller");
const router = express_1.default.Router();
/**
 * @route   GET /:shortCode
 * @desc    Redirect to the original URL + log the click
 * @access  Public
 */
router.get("/:shortCode", redirect_controller_1.handleRedirect);
exports.default = router;
