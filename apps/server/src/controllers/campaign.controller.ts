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
import Campaign from "../database/models/campaign.model";
import { Types } from "mongoose";

const campaignSchema = z.object({
  name: z
    .string()
    .min(5, "Name should contain at least 5 characters")
    .max(20, "Name can contain at most 20 characters"),
  description: z
    .string()
    .min(10, "Description shoould be at least 10 characters"),
});

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
    const campaigns = await getAllCampaigns(req.user?._id as Types.ObjectId);
    res
      .status(200)
      .json(new ApiResponse(200, "All Campaigns", true, campaigns!));
  } catch (error: any) {
    return next(
      normalizeError(
        error,
        "Unexpected error occurred while fetching campaigns",
      ),
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
  const parsed = campaignSchema.safeParse(req.body);

  if (!parsed.success) {
    const messages = parsed.error.issues.map((issue) => issue.message);
    return next(new ApiError(400, "Validation Failed", messages));
  }

  try {
    const data: Pick<ICampaign, "name" | "description" | "user_id"> = {
      name: parsed.data.name,
      description: parsed.data.description,
      user_id: req.user?._id as Types.ObjectId,
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
  } catch (error: any) {
    return next(
      normalizeError(
        error,
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
    const parsed = campaignSchema.safeParse(req.body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message);
      return next(new ApiError(400, "Validation Failed", messages));
    }

    const data: Pick<ICampaign, "name" | "description"> = {
      name: parsed.data.name,
      description: parsed.data.description,
    };

    const updatedCampaign = await updateCampaign(
      new Types.ObjectId(campaignId.toString()),
      req.user?.id as Types.ObjectId,
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
  } catch (error: any) {
    return next(
      normalizeError(
        error,
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
  const { campaignId } = req.params;

  deleteCampaign(new Types.ObjectId(campaignId.toString()), req.user?.id as Types.ObjectId)
    .then(() => {
      res
        .status(200)
        .json(new ApiResponse(200, "Campaign deleted successfully", true));
    })
    .catch((error) => {
      return next(
        normalizeError(
          error,
          "Unexpected error occurred while deleting the campaign",
        ),
      );
    });
}

/**
 * @desc    Get overall campaign statistics for the user
 * @route   GET /api/v1/campaign/stats
 * @access  Authenticated
 */
export async function getUserCampaignStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { total_links, crg, active_links } = await getCampaignStats(
      req.user?._id as Types.ObjectId,
    );
    res.status(200).json(
      new ApiResponse(200, "Campaign Stats", true, {
        total_links,
        crg,
        active_links,
      }),
    );
  } catch (error) {
    return next(
      normalizeError(
        error,
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
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const links = await getRecentCampaigns(req.user?._id as Types.ObjectId);
    res
      .status(200)
      .json(new ApiResponse(200, "Recent Campaigns", true, { links }));
  } catch (error) {
    return next(
      normalizeError(
        error,
        "Unexpected error occurred while getting recent campaigns",
      ),
    );
  }
}
