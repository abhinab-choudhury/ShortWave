import * as dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, required = true, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (required && !value) {
    console.error(`❌ Environment variable ${key} is required but not defined.`);
    process.exit(1);
  }
  return value!;
};

export const env = {
  PORT: getEnv("PORT", false, "8080"),
  CLIENT_URL: getEnv("CLIENT_URL", false, "http://localhost:5173"),
  MONGODB_BASE_URI: getEnv("MONGODB_BASE_URI", false, "mongodb://localhost:27017"),
  DATABASE_NAME: getEnv("DATABASE_NAME", false, "mydatabase"),
  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRY: getEnv("ACCESS_TOKEN_EXPIRY", false, "15m"),
  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRY: getEnv("REFRESH_TOKEN_EXPIRY", false, "7d"),
  SESSION_SECRET: getEnv("SESSION_SECRET"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
};
