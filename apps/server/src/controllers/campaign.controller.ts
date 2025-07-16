import { Request, Response, NextFunction } from "express";
import {
  getAllCampaigns,
  createCampaign,
  deleteCampaign,
  updateCampaign,
  getRecentCampaigns,
  getCampaignStats,
} from "../services/campaign.service";
import { z } from "zod";
import { ICampaign } from "../interfaces/model";
import ApiResponse from "../utils/api-response-handling";
import ApiError, { normalizeError } from "../utils/api-error-handling";

/**
 * @desc    Get all campaigns
 * @route   GET /api/v1/campaign
 * @access  Authenticated
 */
export async function getAllUserCampaigns(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const campaigns = await getAllCampaigns(req.user?._id);
    console.log("All User Campaigns: ", campaigns);
    res
      .status(200)
      .json(new ApiResponse(200, "All Campaigns", true, campaigns!));
  } catch (err: any) {
    return next(
      normalizeError(err, "Unexpected error occurred while fetching campaigns"),
    );
  }
}

/**
 * @desc    Create a new campaign
 * @route   POST /api/v1/campaign
 * @access  Authenticated
 */
export async function createUserCampaign(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const campaignSchema = z.object({
    name: z
      .string()
      .min(5, "Name should contain at least 5 characters")
      .max(20, "Name can contain at most 20 characters"),
    description: z
      .string()
      .min(10, "Description shoould be at least 10 characters"),
  });

  const parsed = campaignSchema.safeParse(req.body);

  if (!parsed.success) {
    const messages = parsed.error.issues.map((issue) => issue.message);
    return next(new ApiError(400, "Validation Failed", messages));
  }

  try {
    const data: Pick<ICampaign, "name" | "description" | "user"> = {
      name: parsed.data.name,
      description: parsed.data.description,
      user: req.user?._id,
    };

    const newCampaign = await createCampaign(data);

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "New campaign created successfully.",
          true,
          newCampaign,
        ),
      );
  } catch (err: any) {
    return next(
      normalizeError(
        err,
        "Unexpected error occurred while creating a new campaign",
      ),
    );
  }
}

/**
 * @desc    Update an existing campaign
 * @route   PATCH /api/v1/campaign/:id
 * @access  Authenticated
 */
export async function updateUserCampaign(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { campaignId } = req.params;
    const data = req.body;

    const updatedCampaign = await updateCampaign(
      campaignId,
      req.user?.id,
      data,
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Campaign updated successfully",
          true,
          updatedCampaign!,
        ),
      );
  } catch (err: any) {
    return next(
      normalizeError(
        err,
        "Unexpected error occurred while updating the campaign",
      ),
    );
  }
}

/**
 * @desc    Delete a campaign by ID
 * @route   DELETE /api/v1/campaign/:id
 * @access  Authenticated
 */
export async function deleteUserCampaign(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { campaignId } = req.params;
    await deleteCampaign(campaignId, req.user?.id);

    res
      .status(204)
      .json(new ApiResponse(204, "Campaign deleted successfully", true));
  } catch (err: any) {
    return next(
      normalizeError(
        err,
        "Unexpected error occurred while deleting the campaign",
      ),
    );
  }
}

/**
 * @desc    Get overall campaign statistics for the user
 * @route   GET /api/v1/campaign/stats
 * @access  Authenticated
 */
export async function getUserCampaignStats(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { total_links, crg, active_campaigns } = await getCampaignStats();
    res.status(200).json(
      new ApiResponse(200, "Campaign Stats", true, {
        total_links,
        crg,
        active_campaigns,
      }),
    );
  } catch (err) {
    return next(
      normalizeError(
        err,
        "Unexpected error occurred while fetching campaign statistics",
      ),
    );
  }
}

/**
 * @desc    Get the most recent campaigns created by the user
 * @route   GET /api/v1/campaign/recent
 * @access  Authenticated
 */
export async function getUsersRecentCampaigns(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const links = await getRecentCampaigns();
    res
      .status(200)
      .json(new ApiResponse(200, "Recent Campaigns", true, { links }));
  } catch (err) {
    return next(
      normalizeError(
        err,
        "Unexpected error occurred while getting recent campaigns",
      ),
    );
  }
}
