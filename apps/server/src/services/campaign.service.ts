import mongoose from "mongoose";
import Campaign from "../database/models/campaign.model";
import { ICampaign, IUser } from "../interfaces/model";
import Url from "../database/models/url.model";
import Location from "../database/models/location.model";
import Click from "../database/models/click.model";

/**
 * Fetch all campaigns for a specific user from the database
 */
export async function getAllCampaigns(
  userId: IUser["_id"],
): Promise<ICampaign[] | null> {
  return await Campaign.find({ user: userId }).sort({ createdAt: -1 });
}

/**
 * Create a new campaign in the database
 */
export async function createCampaign(
  data: Pick<ICampaign, "name" | "user">,
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
  campaignId: string,
  userId: string,
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
  campaignId: string,
  userId: IUser["_id"],
): Promise<void> {
  const deleteCampaignSession = await mongoose.startSession();
  deleteCampaignSession.startTransaction();

  try {
    const urls = await Url.find({ campaign_id: campaignId }).session(
      deleteCampaignSession,
    );
    const urlIds = urls.map((url) => url._id);
    await Location.deleteMany({ url_id: { $in: urlIds } }).session(
      deleteCampaignSession,
    );
    await Click.deleteMany({ url_id: { $in: urlIds } }).session(
      deleteCampaignSession,
    );
    await Url.deleteMany({ campaign_id: campaignId }).session(
      deleteCampaignSession,
    );
    await Campaign.findOneAndDelete({ _id: campaignId, user: userId }).session(
      deleteCampaignSession,
    );
    await deleteCampaignSession.commitTransaction();
    deleteCampaignSession.endSession();

    console.log("Campaign and all related data deleted successfully");
  } catch (err) {
    await deleteCampaignSession.abortTransaction();
    deleteCampaignSession.endSession();
    console.log("Error while deleting the campaign and its related data");
  }
}

/**
 * Gets all the Campaigns in order of the last
 * updated campaign
 */
export async function getRecentCampaigns() {
  const recentCampaigns = await Campaign.find();
  return recentCampaigns;
}

export async function getCampaignStats() {
  const stats = {
    total_links: "10",
    crg: "40.42%",
    active_campaigns: "4",
  };
  return stats;
}
