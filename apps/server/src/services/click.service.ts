import { IClick, IUser } from "../interfaces/model";
import Click from "../database/models/click.model";
import Url from "../database/models/url.model";
import mongoose, { ClientSession } from "mongoose";

export async function getClickById(urlId: string): Promise<IClick> {
  const requiredUrl = await Click.findById(urlId);
  return requiredUrl!;
}

async function increaseOrPushArrayField(
  session: ClientSession,
  short_url: IClick["short_url"],
  date: IClick["date"],
  field: "device" | "os" | "country" | "browser",
  key: string,
  value: string,
  count: number,
) {
  try {
    const incResult = await Click.updateOne(
      {
        short_url,
        date,
        [`${field}.${key}`]: value,
      },
      {
        $inc: {
          [`${field}.$.count`]: count,
        },
      },
      { session },
    );

    if (incResult.modifiedCount === 0) {
      await Click.updateOne(
        { short_url, date },
        {
          $push: {
            [field]: {
              [key]: value,
              count,
            },
          },
        },
        { session },
      );
    }
  } catch (error) {
    console.error(`Error updating ${field}=${value}:`, error);
    throw error;
  }
}

export async function createClick(
  data: Pick<
    IClick,
    "short_url" | "date" | "click_cnt" | "device" | "country" | "os" | "browser"
  >,
): Promise<void> {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Click.updateOne(
        { short_url: data.short_url, date: data.date },
        {
          $inc: { click_cnt: data.click_cnt },
        },
        { upsert: true, session },
      );

      for (const d of data.device) {
        await increaseOrPushArrayField(
          session,
          data.short_url,
          data.date,
          "device",
          "device_name",
          d.device_name,
          d.count,
        );
      }

      for (const o of data.os) {
        await increaseOrPushArrayField(
          session,
          data.short_url,
          data.date,
          "os",
          "os_name",
          o.os_name,
          o.count,
        );
      }

      for (const b of data.browser) {
        await increaseOrPushArrayField(
          session,
          data.short_url,
          data.date,
          "browser",
          "browser_name",
          b.browser_name,
          b.count,
        );
      }

      for (const c of data.country) {
        await increaseOrPushArrayField(
          session,
          data.short_url,
          data.date,
          "country",
          "country_name",
          c.country_name,
          c.count,
        );
      }
    });
  } catch (error) {
    console.error("Error while creating/updating click:", error);
    throw new Error("Failed to update click stats");
  } finally {
    await session.endSession();
  }
}

export async function getTotalCGRPercent(userId: IUser["_id"]) {
  const userUrls = await Url.find({ user_id: userId }).select("short_url");
  const shortUrls = userUrls.map((u) => u.short_url);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  const currentDayClicks = await Click.aggregate([
    {
      $match: {
        short_url: { $in: shortUrls },
        date: yesterday.toISOString().split("T")[0],
      },
    },
    { $group: { _id: null, total: { $sum: "$click_cnt" } } },
  ]);

  const previousDayClicks = await Click.aggregate([
    {
      $match: {
        short_url: { $in: shortUrls },
        date: twoDaysAgo.toISOString().split("T")[0],
      },
    },
    { $group: { _id: null, total: { $sum: "$click_cnt" } } },
  ]);

  const current = currentDayClicks[0]?.total || 0;
  const previous = previousDayClicks[0]?.total || 0;

  console.log("current: ", current);
  console.log("previous: ", previous);

  if (previous === 0) {
    return current > 0 ? "100%" : "0%";
  }

  const cgr = ((current - previous) / previous) * 100;
  return `${cgr.toFixed(2)}%`;
}
