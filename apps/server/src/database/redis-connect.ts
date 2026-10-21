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
    // Redis is only a cache/analytics buffer, so an outage must not take the API
    // down: the redirect handler falls back to a plain DB lookup.
    console.error("Redis Connection Error: ", error);
  }
};

export { redisClient, REDIS_CONNECT };
