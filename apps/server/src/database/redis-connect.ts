import { createClient } from "redis";
import { env } from "../utils/secret";

const redisClient = createClient({
  url: env.REDIS_URL,
  disableOfflineQueue: true,
  socket: { connectTimeout: 5000 },
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () =>
  console.log("Successfully connected to Redis."),
);
redisClient.on("reconnecting", () => console.log("Reconnecting to Redis..."));

let connecting: Promise<void> | null = null;
const REDIS_CONNECT = async () => {
  if (redisClient.isReady) return;
  if (!connecting) {
    connecting = (async () => {
      if (!redisClient.isOpen) await redisClient.connect();
      if (!redisClient.isReady) throw new Error("Redis is reconnecting");
    })().finally(() => {
      connecting = null;
    });
  }
  await connecting;
};

export { redisClient, REDIS_CONNECT };
