import { Request, Response } from "express";
import { redisClient } from "../database/redis-connect";
import crypto from "crypto";
import { createClick } from "../services/click.service";
import { IClick } from "../interfaces/model";
import DB_CONNECT from "../database/db-connect";
import { REDIS_CONNECT } from "../database/redis-connect";
import { parseUserAgent } from "./parse-ua";

/** A stuck Redis must not keep the function open: the click is dropped instead. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

function recordToArray<T extends { [key: string]: number }, R>(
  record: T,
  keyName: keyof R,
  valueName: keyof R,
): R[] {
  return Object.entries(record).map(([k, v]) => {
    return {
      [keyName]: k,
      [valueName]: v,
    } as R;
  });
}

export function getDeviceFingerprint(req: Request): string {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  const ua = req.headers["user-agent"] || "";
  const lang = req.headers["accept-language"] || "";

  const raw = `${ip}|${ua}|${lang}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/**
 * Buffers one click in Redis. The scheduled cron moves the buffer over to Mongo,
 * so the redirect itself never has to wait for a database write.
 */
export function recordClickInBuffer(req: Request, shortCode: string) {
  return withTimeout(bufferClick(req, shortCode), 3000);
}

async function bufferClick(req: Request, shortCode: string) {
  const ttl = 3600; // 1 hour TTL
  const timeStamp = Date.now().toString();

  const userAgent = req.get("user-agent") || "";
  const country = req.get("x-vercel-ip-country") || "unknown";
  const { device, os, browser } = parseUserAgent(userAgent);

  const deviceType = device?.type || "desktop";
  const osType = os?.name || "unknown";
  const browserType = browser?.name || "unknown";

  const fingerprint = getDeviceFingerprint(req);
  const hitKey = `device_hit:${shortCode}:${fingerprint}`;
  const statsKey = `url_stats:${shortCode}:${new Date().toISOString().split("T")[0]}`;

  try {
    // Deduplication and all counters must be atomic with respect to a flush.
    // Unflushed stats have no TTL: a missed cron must not erase clicks.
    await redisClient.eval(
      `
      if not redis.call('SET', KEYS[1], '1', 'EX', ARGV[1], 'NX') then return 0 end
      redis.call('HINCRBY', KEYS[2], 'hits', 1)
      for i = 3, 6 do redis.call('HINCRBY', KEYS[2], ARGV[i], 1) end
      redis.call('HSET', KEYS[2], 'last_access', ARGV[2])
      redis.call('PERSIST', KEYS[2])
      return 1
    `,
      {
        keys: [hitKey, statsKey],
        arguments: [
          String(ttl),
          timeStamp,
          `country:${country}`,
          `os:${osType}`,
          `device:${deviceType}`,
          `browser:${browserType}`,
        ],
      },
    );
  } catch (redisErr) {
    console.error("[Redis Error]", redisErr);
  }
}

// Atomically detach a complete buffer. New clicks recreate the live key.
export const CLAIM_BATCH = `
  if redis.call('EXISTS', KEYS[1]) == 0 then return 0 end
  redis.call('RENAME', KEYS[1], KEYS[2])
  redis.call('PERSIST', KEYS[2])
  return 1
`;

export async function flushRedishStatsToMongo(req: Request, res: Response) {
  const secret = process.env.CRON_SECRET;
  if (!secret)
    return res.status(503).json({ message: "CRON_SECRET is not configured" });
  const supplied = Buffer.from(req.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (
    supplied.length !== expected.length ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const result = await withTimeout(flushBatches(), 25000);
    return res.status(200).json(result);
  } catch (error) {
    console.error("[Analytics sync failed]", error);
    return res
      .status(503)
      .json({ message: "Analytics sync unavailable; retry later" });
  }
}

export async function flushBatches() {
  await Promise.all([DB_CONNECT(), REDIS_CONNECT()]);
  const deadline = Date.now() + 15000;
  let processed = 0;
  // Retry detached batches before claiming new ones. SCAN avoids blocking Redis.
  for (const pattern of ["analytics_pending:*", "url_stats:*"]) {
    for await (const keys of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 50,
    })) {
      for (const key of keys) {
        if (processed >= 50 || Date.now() >= deadline) {
          return {
            processed,
            message: "Batch limit reached; remaining data retained",
          };
        }
        const [, shortCode, date] = key.split(":");
        if (!shortCode || !date) continue;
        let batchKey = key;
        if (pattern === "url_stats:*") {
          batchKey = `analytics_pending:${shortCode}:${date}:${crypto.randomUUID()}`;
          const claimed = await redisClient.eval(CLAIM_BATCH, {
            keys: [key, batchKey],
            arguments: [],
          });
          if (!claimed) continue;
        }
        const data = await redisClient.hGetAll(batchKey);
        if (Object.keys(data).length === 0) continue;
        await persistBatch(shortCode, date, batchKey, data);
        // A Mongo receipt makes retry safe even if this delete fails.
        await redisClient.del(batchKey);
        processed++;
      }
    }
  }
  return {
    processed,
    message: processed ? "Analytics synced" : "No stats found",
  };
}

async function persistBatch(
  shortCode: string,
  date: string,
  batchKey: string,
  data: Record<string, string>,
) {
  const clickCount = parseInt(data.hits || "0", 10);

  const country: Record<string, number> = {};
  const os: Record<string, number> = {};
  const device: Record<string, number> = {};
  const browser: Record<string, number> = {};

  for (const [field, value] of Object.entries(data)) {
    if (field.startsWith("country:")) {
      country[field.split(":")[1]] = parseInt(value, 10);
    } else if (field.startsWith("os:")) {
      os[field.split(":")[1]] = parseInt(value, 10);
    } else if (field.startsWith("device:")) {
      device[field.split(":")[1]] = parseInt(value, 10);
    } else if (field.startsWith("browser:")) {
      browser[field.split(":")[1]] = parseInt(value, 10);
    }
  }

  const clickData: Pick<
    IClick,
    "short_url" | "date" | "click_cnt" | "device" | "country" | "os" | "browser"
  > = {
    short_url: shortCode,
    click_cnt: clickCount,
    date: date,
    device: recordToArray(device, "device_name", "count"),
    country: recordToArray(country, "country_name", "count"),
    os: recordToArray(os, "os_name", "count"),
    browser: recordToArray(browser, "browser_name", "count"),
  };

  await createClick(clickData, batchKey);
}
