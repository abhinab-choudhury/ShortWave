import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import ApiError from "../utils/api-error-handling";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../services/user.services";
import { z } from "zod";
import { IUser } from "../interfaces/model";
import { sendSignInEmail, sendWelcomeEmail } from "../utils/email";
import { env } from "../utils/secret";
import { blockJWT, findBlockedJWT } from "../services/blockjwt.service";
import ApiResponse from "../utils/api-response-handling";

const signinReqSchema = z.object({
  email: z.string().email().trim(),
});

export async function me(req: Request, res: Response, next: NextFunction) {
  if (req.user?._id) {
    res.status(200).json(
      new ApiResponse(200, "User Authenticated", true, {
        user: {
          userId: req.user?._id,
          email: req.user?.email,
          name: req.user?.name,
          profilePic: req.user?.profilePic,
        },
      }),
    );
  } else {
    return next(new ApiError(401, "User Unauthorized"));
  }
}

export async function signinUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedReq = signinReqSchema.parse(req.body.data);
    let user = (await getUserByEmail(parsedReq.email)) as IUser;

    let userId: string;
    if (!user) {
      const newUser: Pick<IUser, "email" | "name" | "admin"> = {
        email: parsedReq.email,
        name: parsedReq.email.split("@")?.[0],
        admin: false,
      };
      await sendWelcomeEmail(newUser.name, newUser.email);
      const response = await createUser(newUser);
      userId = response._id.toString();
      user = response;
    } else {
      userId = user._id.toString();
    }

    const emailToken = jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await sendSignInEmail(
      user.email,
      user.name,
      req.headers["user-agent"]!,
      emailToken,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "A verification email has been sent. Please check your inbox to complete sign-in.",
          true,
        ),
      );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`,
      );
      return next(new ApiError(400, "Validation failed", messages));
    }
    console.log("Error: ", error);
    return next(new ApiError(500, "Unexprected error occured", error));
  }
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.query.token as string;
  const existingToken = await findBlockedJWT(token);

  if (!token || typeof token !== "string" || existingToken?.jwt === token) {
    return next(new ApiError(400, "Invalid Token"));
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };

    const user = await getUserById(new mongoose.Types.ObjectId(payload.userId));
    if (!user) return next(new ApiError(400, "User not found"));

    await new Promise<void>((resolve, reject) => {
      req.logIn(user, function (error) {
        if (error)
          return reject(new ApiError(500, "Login failed", [error.message]));
        return resolve();
      });
    });

    await blockJWT(token);

    res.redirect(`${env.CLIENT_URL}/dashboard`);
  } catch (error: any) {
    return next(new ApiError(400, "Invalid Token or Expired", [error.message]));
  }
}

/**
 * req.logout() logs the user out of Passport's internal state.
 * req.session.destroy() deletes their session from the session store.
 * res.clearCookie() deletes the session cookie on the client.
 */
export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    req.session.destroy((error) => {
      if (error) {
        return next(
          new ApiError(500, "Failed to destroy session", [error.messaege]),
        );
      }
      res.clearCookie("connect.sid");
      return res
        .status(200)
        .json(new ApiResponse(200, "User logged out successfully"));
    });
  } catch (error: any) {
    return next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unexpcted error during logout", error),
    );
  }
}

export function googleOAuth(_req: Request, res: Response) {
  res.status(200).json(new ApiResponse(200, "User Signin with Google", true));
}

export function githubOAuth(_req: Request, res: Response) {
  res.status(200).json(new ApiResponse(200, "User Signin with Github", true));
}
