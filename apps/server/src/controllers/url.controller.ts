import { NextFunction, Request, Response } from "express";
import z from "zod";
import sha256 from "sha256";
import ApiError, { normalizeError } from "../utils/api-error-handling";
import {
  createCampaignUrl,
  deleteUrl,
  getAllCampaignUrlsClick,
  getLongUrlHandler,
} from "../services/url.services";
import { IUrl } from "../interfaces/model";
import ApiResponse from "../utils/api-response-handling";

const urlSchema = z.object({
  url: z.string().url(),
  to_date: z.date().optional(),
  from_date: z.date().optional(),
});

/**
 * @desc    Get details of a specific short URL
 * @route   GET /api/v1/url/:urlId
 * @access  Authenticated
 */
export async function getUserUrlDetails() {}

/**
 * @desc    Delete a short URL
 * @route   DELETE /api/v1/url/:urlId
 * @access  Authenticated
 */
export async function deleteUserUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shortLink } = req.params;
    await deleteUrl(req.user?._id, shortLink);
    res
      .status(200)
      .json(new ApiResponse(200, "short-url deleted successfully", true));
  } catch (error) {
    return next(
      normalizeError(error, "Unexprected error occured while deleting the url"),
    );
  }
}

/**
 * @desc    Create a new short URL inside a campaign
 * @route   POST /api/v1/campaign/:campaignId/url
 * @access  Authenticated
 */
export async function createUserUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsed = urlSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message);
    return next(new ApiError(400, "Validation Failed", message));
  }

  try {
    const { campaignId } = req.params;
    let attempt = 0;
    let shortened_url;
    let longUrl;

    do {
      const stringToHash = parsed.data.url + (attempt > 0 ? attempt : "");
      shortened_url = sha256(stringToHash).slice(-6);

      longUrl = await getLongUrlHandler(shortened_url);
      attempt++;
    } while (longUrl);

    const data: Pick<
      IUrl,
      | "user_id"
      | "campaign_id"
      | "original_url"
      | "short_url"
      | "from_date"
      | "to_date"
    > = {
      user_id: req.user?._id,
      campaign_id: campaignId,
      original_url: parsed.data.url,
      short_url: shortened_url,
      from_date: parsed.data.from_date,
      to_date: parsed.data.to_date,
    };
    const response = await createCampaignUrl(data);
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "New Shorterned URL created successfully.",
          true,
          response,
        ),
      );
  } catch (err: any) {
    return next(
      normalizeError(err, "Unexpected error occured while creating a new url"),
    );
  }
}

/**
 * @desc    Get all URLs inside a campaign
 * @route   GET /api/v1/campaign/:campaignId/url
 * @access  Authenticated
 */
export async function getUserUrlsBycampaign(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { campaignId } = req.params;
    const campaignUrls = await getAllCampaignUrlsClick(campaignId);
    res
      .status(200)
      .json(
        new ApiResponse(200, "All Urls for the Campaign", true, campaignUrls),
      );
  } catch (error) {
    return next(
      normalizeError(
        error,
        "Unexpected error occured while fetching campaigns",
      ),
    );
  }
}
