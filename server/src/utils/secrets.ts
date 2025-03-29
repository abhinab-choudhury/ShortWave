import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || "8080";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const MONGODB_CONNECTION_STRING = `${process.env.MONGODB_CONNECTION_STRING}/${process.env.DATABASE_NAME}`;
export const DATABASE_NAME = process.env.DATABASE_NAME || "mydatabase";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const requiredEnvVariables = [
  "PORT",
  "CLIENT_URL",
  "MONGODB_CONNECTION_STRING",
  "DATABASE_NAME",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];

requiredEnvVariables.some((envVar: string) => {
  if (!process.env[envVar]) {
    console.log(envVar, "is required.");
    process.exit(1);
  }
});
