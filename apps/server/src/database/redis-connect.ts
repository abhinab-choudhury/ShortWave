import { createClient } from "redis";
import { env } from "../utils/secret";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () =>
  console.log("Successfully connected to Redis."),
);
redisClient.on("reconnecting", () => console.log("Reconnecting to Redis..."));

const REDIS_CONNECT = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis Connection Error: ", error);
    process.exit(1);
  }
};

export { redisClient, REDIS_CONNECT };
