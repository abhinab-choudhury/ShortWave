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
exports.sendSignInEmail = exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const secret_1 = require("./secret");
const ua_parser_js_1 = require("ua-parser-js");
const api_error_handling_1 = __importDefault(require("./api-error-handling"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: secret_1.env.EMAIL,
        pass: secret_1.env.EMAIL_PASSWORD,
    },
});
const sendWelcomeEmail = function (username, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const emailTemplate = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Welcome to Shortwave</title>
      </head>
      <body>
        <h1>Welcome to Shortwave, ${username}!</h1>
        <p>We're excited to have you join us. 🚀</p>
      </body>
    </html>
  `;
        yield sendEmail(email, "Welcome to Shotwave!", emailTemplate);
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendSignInEmail = (email, username, userAgent, token) => __awaiter(void 0, void 0, void 0, function* () {
    const parser = new ua_parser_js_1.UAParser(userAgent);
    const uaResult = parser.getResult();
    const browser = uaResult.browser.name || "Unknown Browser";
    const os = uaResult.os.name || "Unknown OS";
    const time = new Date().toLocaleString("en-US", { timeZoneName: "short" });
    const emailTemplate = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Your Magic Link</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            color: #111827;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          .logo {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
          }
          .logo img {
            height: 32px;
          }
          .logo span {
            font-weight: bold;
            margin-left: 5px;
            font-size: 20px;
            color: #111827;
          }
          .header {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 12px;
          }
          .content {
            font-size: 16px;
            margin-bottom: 24px;
            color: #4b5563;
          }
          .btn {
            display: inline-block;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 6px;
            font-weight: bold;
            transition: background-color 0.3s ease;
          }
          .btn:hover {
            background-color: #333333;
          }
          .raw-link {
            margin-top: 20px;
            font-size: 14px;
            color: #4b5563;
            word-break: break-all;
            text-align: left;
          }
          .raw-link a {
            color: #2563eb;
            text-decoration: none;
          }
          .info-box {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            text-align: left;
            color: #374151;
            font-size: 14px;
          }
          .footer {
            font-size: 13px;
            color: #9ca3af;
            margin-top: 20px;
          }
          @media screen and (max-width: 600px) {
            .container {
              padding: 20px;
            }
            .btn {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://short-wave.vercel.app/shortwave_logo.png" alt="Shortwave" />
            <span>Shortwave</span>
          </div>
          <div class="header">Hi ${username}, here’s your magic link</div>
          <div class="content">
            Click the button below to securely log in. This magic link will expire in 20 minutes.
          </div>
          <a href="${secret_1.env.SERVER_URL}/api/v1/auth/verify?token=${token}" class="btn">Login to Shortwave</a>
          <div class="raw-link">
            If the button doesn't work, copy and paste this URL into your browser:<br />
            <a href="${secret_1.env.SERVER_URL}/api/v1/auth/verify?token=${token}">${secret_1.env.SERVER_URL}/api/v1/auth/verify?token=${token}</a>
          </div>
          <div class="info-box">
            This login was requested using <strong>${browser} on ${os}</strong> at <strong>${time}</strong>.
          </div>
          <div class="footer">
            You are receiving this email because you signed up for Shortwave.<br /><br />
            &copy; ${new Date().getFullYear()} Shortwave. All rights reserved.
          </div>
        </div>
      </body>
    </html>
    `;
    yield sendEmail(email, "Your Shortwave Magic Link", emailTemplate);
});
exports.sendSignInEmail = sendSignInEmail;
function sendEmail(email, title, emailTemplate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield transporter.sendMail({
                from: '"Shortwave" <noreply@shortwave.com>',
                to: email,
                subject: title,
                html: emailTemplate,
                text: "Please view this email in HTML-compatible client.",
            });
        }
        catch (error) {
            throw new api_error_handling_1.default(500, "Failed to send email", [
                (error === null || error === void 0 ? void 0 : error.message) || "Unknown error from email service",
            ]);
        }
    });
}
