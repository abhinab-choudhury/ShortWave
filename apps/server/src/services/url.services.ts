import mongoose from "mongoose";
import Url from "../database/models/url.model";
import { redisClient } from "../database/redis-connect";
import { IUrl } from "../interfaces/model";
import Campaign from "../database/models/campaign.model";

/* Create a new URL in DB */
export async function createCampaignUrl(
  data: Pick<
    IUrl,
    | "user_id"
    | "campaign_id"
    | "original_url"
    | "short_url"
    | "from_date"
    | "to_date"
  >,
): Promise<IUrl> {
  const url = new Url(data);
  return await url.save();
}

export async function getLongUrl(short_url: IUrl["short_url"]) {
  const longUrl = await Url.findOne({ short_url })
    .select("original_url -_id")
    .lean();

  return longUrl?.original_url;
}

/* Gets the Long/Original URL for the short-url(uses redis for cacheing) */
export async function getLongUrlHandler(
  short_url: string,
): Promise<string | undefined> {
  if (redisClient.isReady) {
    try {
      const cachedUrl = await redisClient.get(short_url);
      if (cachedUrl) {
        console.log(`CACHE HIT for: ${short_url}`);
        return cachedUrl; // ✅ Cache Hit
      }
    } catch (error) {
      console.error("Error reading from Redis:", error);
    }
  }

  console.log(`CACHE MISS for: ${short_url}. Querying DB...`);
  const urlFromDb = await getLongUrl(short_url);

  if (urlFromDb && redisClient.isReady) {
    try {
      await redisClient.set(short_url, urlFromDb, { EX: 3600 }); // ✅ Cache Population
    } catch (error) {
      console.error("Failed to write to Redis cache:", error);
    }
  }

  return urlFromDb;
}

/**
 * get all the links which are created by the user
 * over all the campaigns
 * */
async function getAllUrl(): Promise<IUrl[]> {
  return await Url.find();
}

/* get all urls for a given campaign */
export async function getAllCampaignUrls(campaignId: string): Promise<IUrl[]> {
  if (!mongoose.Types.ObjectId.isValid(campaignId)) {
    console.log("Invalid Campaign ID.");
    return [];
  }
  const result = await Campaign.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(campaignId),
      },
    },
    {
      $lookup: {
        from: "urls",
        localField: "_id",
        foreignField: "campaign_id",
        as: "urls",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        urls: 1,
      },
    },
  ]);
  return result.length > 0 ? result[0] : [];
}

/* delete a specific url from a campaign by the help of short_url */
export async function deleteUrl(short_url: string) {
  return await Url.deleteOne({ short_url });
}

/* get Count of URL which is created */
export async function getTotalLinkCnt(): Promise<Number> {
  return await Url.countDocuments();
}

/* get all active-link cnt */
export async function getActiveLinkCnt(): Promise<Number> {
  let activeLinkCnt = 0;
  const allLinks = await getAllUrl();
  const now = new Date();
  allLinks.forEach((link) => {
    const fromDate = link.from_date;
    const toDate = link.to_date;
    if ((!fromDate || now >= fromDate) && (!toDate || now <= toDate))
      activeLinkCnt++;
  });

  return activeLinkCnt;
}
