import * as dotenv from "dotenv";
dotenv.config();

const getEnv = (
  key: string,
  required = true,
  defaultValue?: string,
): string => {
  const value = process.env[key] || defaultValue;
  if (required && !value) {
    console.error(`Environment variable ${key} is required but not defined.`);
    process.exit(1);
  }
  return value!;
};

export const env = {
  PORT: getEnv("PORT", false, "8080"),
  NODE_ENV: getEnv("NODE_ENV", false, "development"), // development | production
  CLIENT_URL: getEnv("CLIENT_URL", false, "http://localhost:5173"),
  SERVER_URL: getEnv("SERVER_URL", false, "http://localhost:8080"),
  EMAIL: getEnv("EMAIL"),
  EMAIL_PASSWORD: getEnv("EMAIL_PASSWORD"),
  MONGODB_BASE_URI: getEnv(
    "MONGODB_BASE_URI",
    false,
    "mongodb://localhost:27017",
  ),
  REDIS_URL: getEnv("REDIS_URL", false, "redis://localhost:6379"),
  DATABASE_NAME: getEnv("DATABASE_NAME", false, "mydatabase"),
  SESSION_SECRET: getEnv("SESSION_SECRET"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GITHUB_CLIENT_ID: getEnv("GITHUB_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: getEnv("GITHUB_CLIENT_SECRET"),
};
