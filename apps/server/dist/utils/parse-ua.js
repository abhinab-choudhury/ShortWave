"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserAgent = parseUserAgent;
const ua_parser_js_1 = require("ua-parser-js");
function parseUserAgent(userAgent) {
    const parse = new ua_parser_js_1.UAParser(userAgent);
    const result = parse.getResult();
    const device = result.device || "Unknown";
    const os = result.os || "Unknown";
    const browser = result.browser || "Unknown";
    return { device, os, browser };
}
