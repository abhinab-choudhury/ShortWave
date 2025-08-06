import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/api-response-handling";
import ApiError from "../utils/api-error-handling";
import { changeUsername } from "../services/user.services";

export async function changeUsersUsername(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data: { username: string } = req.body;
    if (data.username.trim()) {
      const newUser = await changeUsername(req.user?._id, {
        name: data.username.trim(),
      });
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Username updated successfully.",
            true,
            newUser!,
          ),
        );
    }
  } catch (error) {
    console.log("Error: ", error);
    return next(new ApiError(400, "Failed to change the username"));
  }
}
