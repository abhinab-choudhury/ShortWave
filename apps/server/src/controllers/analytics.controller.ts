import { NextFunction, Request, Response } from "express";
import { handleAnalytics } from "../services/analytics.service";

/**
 * @desc    Update the analytics
 * @route   GET /api/v1/campaign
 * @access  Authenticated
 */
export async function updateAnalytics(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { urlId } = req.params;
    const response = await handleAnalytics(req, urlId, req.user?._id as string);
  } catch (error) {}
}
