import { Request, Response } from "express";
import { redisClient } from "../database/redis-connect";
import crypto from "crypto";
import { createClick } from "../services/click.service";
import { IClick } from "../interfaces/model";

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

export async function flushRedishStatsToMongo(req: Request, res: Response) {
  const url_stats_keys = await redisClient.keys("url_stats:*");

  if (url_stats_keys.length === 0) {
    return res.status(200).json({ message: "No stats found" });
  }

  for (const key of url_stats_keys) {
    const data = await redisClient.hGetAll(key);

    if (!data || Object.keys(data).length === 0) {
      continue;
    }

    const [, shortCode, date] = key.split(":");
    if (!shortCode || !date) {
      console.warn(`Skipping invalid Redis key: ${key}`);
      continue;
    }

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
      | "short_url"
      | "date"
      | "click_cnt"
      | "device"
      | "country"
      | "os"
      | "browser"
    > = {
      short_url: shortCode,
      click_cnt: clickCount,
      date: date,
      device: recordToArray(device, "device_name", "count"),
      country: recordToArray(country, "country_name", "count"),
      os: recordToArray(os, "os_name", "count"),
      browser: recordToArray(browser, "browser_name", "count"),
    };

    try {
      await createClick(clickData);
    } catch (error) {
      console.error("Error during MongoDB insert:", error);
    }
  }

  // cleanup (after all keys processed)
  if (url_stats_keys.length > 0) {
    await redisClient.del(url_stats_keys);
  }

  console.log(`Flushed and deleted Redis keys`);
  return res.status(200).json({ message: "CRON hit and data flushed" });
}
