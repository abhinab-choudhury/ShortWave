import { Request, Response, NextFunction } from "express";
import { getLongUrlHandler } from "../services/url.services";
import ApiError from "../utils/api-error-handling";
import { parseUserAgent } from "../utils/parse-ua";
import { redisClient } from "../database/redis-connect";
import { getDeviceFingerprint } from "../utils/redis-helpers";

/**
 * @desc   Redirect handler with analytics
 * @route  GET /:shortCode
 */
export async function handleRedirect(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.method === "POST") {
    return next(new ApiError(405, "POST method not allowed"));
  }

  const { shortCode } = req.params;
  if (!shortCode) {
    return next(new ApiError(400, "ShortCode Not Provided"));
  }

  try {
    const longUrl = await getLongUrlHandler(shortCode);
    if (!longUrl) {
      return next(new ApiError(404, "Short URL Not Found"));
    }

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
    const statsKey = `url_stats:${shortCode}:${new Date().toLocaleDateString().split("/").reverse().join("-")}`;

    try {
      // Set device fingerprint to prevent duplicate stats
      const isUniqueDevice = await redisClient.set(hitKey, "1", {
        expiration: { type: "EX", value: ttl },
        condition: "NX",
      });

      // Only update stats for unique devices
      if (isUniqueDevice) {
        await redisClient.hIncrBy(statsKey, "hits", 1);
        await redisClient.hIncrBy(statsKey, `country:${country}`, 1);
        await redisClient.hIncrBy(statsKey, `os:${osType}`, 1);
        await redisClient.hIncrBy(statsKey, `device:${deviceType}`, 1);
        await redisClient.hIncrBy(statsKey, `browser:${browserType}`, 1);
        await redisClient.hSet(statsKey, "last_access", timeStamp);

        // update the expire as per the latest entry.
        await redisClient.expire(statsKey, ttl);
      }
    } catch (redisErr) {
      console.error("[Redis Error]", redisErr);
    }

    console.log(`[Redirect] ${shortCode} → ${longUrl}`);
    return res.redirect(302, longUrl);
  } catch (error: any) {
    console.error("[Redirect Error]", error);
    return next(new ApiError(500, "Internal Server Error", error));
  }
}
