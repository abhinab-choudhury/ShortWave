import nodemailer from "nodemailer";
import { env } from "./secret";
import { UAParser } from "ua-parser-js";
import ApiError from "./api-error-handling";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL,
    pass: env.EMAIL_PASSWORD,
  },
});

export const sendWelcomeEmail = async function (
  username: string,
  email: string,
) {
  const emailTemplate = `
    <html>
      <h1>Welcome to Shortware, ${username}
    </html>
    `;
  console.log("Email: ", env.EMAIL);
  console.log("Mail Password: ", env.EMAIL_PASSWORD);
  await sendEmail(email!, "Welcome to Shotwave!", emailTemplate);
};

export const sendSignInEmail = async (
  email: string,
  username: string,
  userAgent: string,
  token: string,
) => {
  const parser = new UAParser(userAgent);
  const uaResult = parser.getResult();
  const browser = uaResult.browser.name || "Unknown Browser";
  const os = uaResult.os.name || "Unknown OS";
  const time = new Date().toLocaleString("en-US", { timeZoneName: "short" });

  const emailTemplate = `
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your Magic Link</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #111827; }
            .container { max-width: 600px; margin: 80px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
            .logo { display: flex; align-items: center; gap: 4px; padding: 10px; justify-content: center; }
            .logo img { height: 30px; }
            .logo span { font-weight: bolder; font-size: larger; color: #111827; }
            .header { font-size: 24px; font-weight: bold; margin: 20px 0; color: #111827; }
            .content { font-size: 16px; margin-bottom: 20px; color: #111827; }
            .btn { display: inline-block; background-color: black; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
            .raw-link { margin-top: 16px; font-size: 14px; word-break: break-all; color: #111827; }
            .info-box { background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: left; color: #111827; }
            .footer { font-size: 14px; color: #6b7280; margin-top: 20px; }
            @media screen and (max-width: 600px) {
              body, .container { height: auto; padding: 0px 8px; margin: 0; }
              .container { display: flex; flex-direction: column; justify-content: center; align-items: center; }
              .btn { width: fit-content; text-align: center; }
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
            <a href="${env.SERVER_URL}/api/v1/auth/verify?token=${token}" class="btn">Login to Shortwave</a>
            <div class="raw-link">
              If the button doesn't work, copy and paste this URL into your browser:<br />
              <a style="text-decoration: none; color:white;" href="${env.SERVER_URL}/api/v1/auth/verify?token=${token}" style="color: #2563eb;">
                ${env.SERVER_URL}/api/v1/auth/verify?token=${token}
              </a>
            </div>
            <div class="info-box">
              <p>
                This login was requested using <strong>${browser} on ${os}</strong> at <strong>${time}</strong>.
              </p>
            </div>
            <div class="footer">
              You are receiving this email because you signed up for Shortwave.
              <br /><br />
              &copy; ${new Date().getFullYear()} Shortwave. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

  await sendEmail(email, "Your Shortwave Magic Link", emailTemplate);
};

async function sendEmail(email: string, title: string, emailTemplate: string) {
  try {
    await transporter.sendMail({
      from: '"Shortwave" <noreply@shortwave.com>',
      to: email,
      subject: title,
      html: emailTemplate,
      text: "Please view this email in HTML-compatible client.",
    });
  } catch (err: any) {
    throw new ApiError(500, "Failed to send email", [
      err?.message || "Unknown error from email service",
    ]);
  }
}
