import mongoose from "mongoose";
import Campaign from "../database/models/campaign.model";
import { ICampaign, IUser } from "../interfaces/model";
import Url from "../database/models/url.model";
import Click from "../database/models/click.model";
import { getActiveLinkCnt, getTotalLinkCnt } from "./url.services";
import { getTotalCGRPercent } from "./click.service";

/**
 * Fetch all campaigns for a specific user from the database
 */
export async function getAllCampaigns(
  userId: IUser["_id"],
): Promise<ICampaign[] | null> {
  return await Campaign.find({ user_id: userId }).sort({ createdAt: -1 });
}

/**
 * Create a new campaign in the database
 */
export async function createCampaign(
  data: Pick<ICampaign, "name" | "user_id">,
): Promise<ICampaign> {
  const campaign = new Campaign(data);
  return await campaign.save();
}

/**
 * Fetch a single campaign by its ID
 */
export async function getCampaignById(
  campaignId: string,
  userId: IUser["_id"],
): Promise<ICampaign | null> {
  return await Campaign.findOne({ _id: campaignId, user: userId });
}

/**
 * Update a campaign by ID
 * updates name of the campaign
 */
export async function updateCampaign(
  campaignId: ICampaign["_id"],
  userId: IUser["_id"],
  data: Partial<ICampaign>,
): Promise<ICampaign | null> {
  return await Campaign.findOneAndUpdate(
    { _id: campaignId, user: userId },
    data,
    { new: true },
  );
}

/**
 * Delete a campaign by ID
 */
export async function deleteCampaign(
  campaignId: ICampaign["_id"],
  userId: IUser["_id"],
): Promise<void> {
  const deleteCampaignSession = await mongoose.startSession();
  deleteCampaignSession.startTransaction();

  try {
    const urls = await Url.find({ campaign_id: campaignId }).session(
      deleteCampaignSession,
    );
    const urlIds = urls.map((url) => url._id);

    await Click.deleteMany({ url_id: { $in: urlIds } }).session(
      deleteCampaignSession,
    );
    await Url.deleteMany({ user_id: userId, campaign_id: campaignId }).session(
      deleteCampaignSession,
    );
    const deleted = await Campaign.findByIdAndDelete(campaignId).session(
      deleteCampaignSession,
    );

    await deleteCampaignSession.commitTransaction();
    console.log(
      "Campaign and all related data deleted successfully.\nDeleted: ",
      deleted,
    );
  } catch (error) {
    await deleteCampaignSession.abortTransaction();
    console.error("Error during campaign deletion:", error);
    throw error;
  } finally {
    deleteCampaignSession.endSession();
  }
}

/**
 * Gets all the Campaigns in order of the last
 * updated campaign
 */
export async function getRecentCampaigns(userId: IUser["_id"]) {
  const recentCampaigns = await Campaign.find({ user_id: userId })
    .sort({ updatedAt: -1 })
    .limit(3);
  return recentCampaigns;
}

/* Get Campaign Status for the all dashboard.  */
export async function getCampaignStats(userId: IUser["_id"]) {
  const totalLinkCnt = await getTotalLinkCnt(userId);
  const cgrPercent = await getTotalCGRPercent(userId);
  const activeLinkCnt = await getActiveLinkCnt(userId);

  const stats = {
    total_links: totalLinkCnt,
    crg: cgrPercent,
    active_links: activeLinkCnt,
  };
  return stats;
}
