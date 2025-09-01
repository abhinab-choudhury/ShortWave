import mongoose from "mongoose";
import Url from "../database/models/url.model";
import { redisClient } from "../database/redis-connect";
import { IClick, IUrl, IUser } from "../interfaces/model";
import Campaign from "../database/models/campaign.model";
import Click from "../database/models/click.model";

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
    .select("original_url")
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
      await redisClient.set(short_url, urlFromDb, {
        expiration: {
          type: "EX",
          value: 3600,
        },
      }); // ✅ Cache Population
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
async function getAllUrl(userId: IUser["_id"]): Promise<IUrl[]> {
  return await Url.find({ user_id: userId });
}

/* delete a specific url from a campaign by the help of short_url */
export async function deleteUrl(
  userId: IUser["_id"],
  shortUrl: IUrl["short_url"],
) {
  const deleteUrlSession = await mongoose.startSession();
  deleteUrlSession.startTransaction();
  try {
    const urlDoc = await Url.findOne({
      short_url: shortUrl,
    }).session(deleteUrlSession);

    if (!urlDoc) {
      throw new Error("URL not found or not authorized");
    }
    await Url.deleteOne({ short_url: urlDoc.short_url }).session(
      deleteUrlSession,
    );
    await Click.deleteMany({ short_url: urlDoc.short_url }).session(
      deleteUrlSession,
    );

    await deleteUrlSession.commitTransaction();
  } catch (error) {
    await deleteUrlSession.abortTransaction();
    console.error("Error during url deletion: ", error);
    throw error;
  } finally {
    deleteUrlSession.endSession();
  }
}

// get all the urls data from that campaign.
export async function getAllCampaignUrlsClick(campaignId: string) {
  if (!mongoose.Types.ObjectId.isValid(campaignId)) {
    console.log("Invalid Campaign ID.");
    return null;
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
      $unwind: "$urls",
    },
    {
      $lookup: {
        from: "clicks",
        localField: "urls.short_url",
        foreignField: "short_url",
        as: "urls.clicks",
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        urls: { $push: "$urls" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        urls: {
          short_url: 1,
          original_url: 1,
          createdAt: 1,
          clicks: 1,
        },
      },
    },
  ]);

  return result.length > 0 ? result[0] : null;
}

/* get Count of URL which is created */
export async function getTotalLinkCnt(userId: IUser["_id"]): Promise<Number> {
  return await Url.find({ user_id: userId }).countDocuments();
}

/* get all active-link cnt */
export async function getActiveLinkCnt(userId: IUser["_id"]): Promise<Number> {
  let activeLinkCnt = 0;
  const allLinks = await getAllUrl(userId);
  const now = new Date();
  allLinks.forEach((link) => {
    const fromDate = link.from_date;
    const toDate = link.to_date;
    if ((!fromDate || now >= fromDate) && (!toDate || now <= toDate))
      activeLinkCnt++;
  });

  return activeLinkCnt;
}
