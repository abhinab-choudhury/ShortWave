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
import { env } from "../utils/secret";
import { blockJWT, findBlockedJWT } from "../services/blockjwt.service";
import Otp from "../database/models/otp.model";
import {
  findOtpByEmail,
  hasExceededMaxAttempts,
  isOtpExpired,
  isOtpValid,
  OTP_MAX_ATTEMPTS,
  OTP_TTL_MS,
  storeOtp,
} from "../services/otp.services";
import { sendOtpEmail, sendSignInEmail, sendWelcomeEmail } from "../utils/email";
import ApiResponse from "../utils/api-response-handling";
import { Types } from "mongoose";

const signinReqSchema = z.object({
  email: z.string().email().trim(),
});

const verifyOtpReqSchema = z.object({
  email: z.string().email().trim(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

function isNativeRequest(req: Request): boolean {
  return (
    req.query.platform === "native" ||
    req.query.state === "native" ||
    req.headers["x-native-platform"] === "capacitor" ||
    (typeof req.headers.origin === "string" &&
      req.headers.origin.includes("capacitor://"))
  );
}

export async function requestOtp(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = verifyOtpReqSchema
      .pick({ email: true })
      .parse(req.body.data ?? req.body);

    let user = await getUserByEmail(parsed.email);
    if (!user) {
      const newUser: Pick<IUser, "email" | "name" | "admin"> = {
        email: parsed.email,
        name: parsed.email.split("@")?.[0],
        admin: false,
      };
      await sendWelcomeEmail(newUser.name, newUser.email);
      user = await createUser(newUser);
    }

    const otp = await storeOtp(parsed.email);

    await sendOtpEmail(user.email, user.name, otp);

    res.status(200).json(
      new ApiResponse(
        200,
        "A 6-digit verification code has been sent to your email.",
        true,
        { expiresInSeconds: OTP_TTL_MS / 1000 },
      ),
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`,
      );
      return next(new ApiError(400, "Validation failed", messages));
    }
    console.log("Error requesting OTP: ", error);
    return next(new ApiError(500, "Unexprected error occurred", error));
  }
}

export async function verifyOtp(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = verifyOtpReqSchema.parse(req.body.data ?? req.body);

    const record = await findOtpByEmail(parsed.email);
    if (!record) {
      return next(
        new ApiError(
          400,
          "No verification code found for this email. Please request a new one.",
        ),
      );
    }

    if (isOtpExpired(record)) {
      await Otp.findOneAndDelete({ email: parsed.email.toLowerCase() });
      return next(
        new ApiError(400, "This code has expired. Please request a new one."),
      );
    }

    if (!isOtpValid(parsed.otp, record)) {
      record.attempts += 1;
      await record.save();
      if (hasExceededMaxAttempts(record)) {
        await Otp.findOneAndDelete({ email: parsed.email.toLowerCase() });
        return next(
          new ApiError(
            400,
            "Too many incorrect attempts. Please request a new code.",
          ),
        );
      }
      const remaining = OTP_MAX_ATTEMPTS - record.attempts;
      return next(
        new ApiError(
          400,
          `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
        ),
      );
    }

    const user = await getUserByEmail(parsed.email);
    if (!user) return next(new ApiError(400, "User not found"));

    await Otp.findOneAndDelete({ email: parsed.email.toLowerCase() });

    const authToken = generateAuthToken(user._id);

    res.status(200).json(
      new ApiResponse(200, "Sign-in successful", true, {
        token: authToken,
        user: {
          userId: user._id,
          email: user.email,
          name: user.name,
          profilePic: user.profilePic,
        },
      }),
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`,
      );
      return next(new ApiError(400, "Validation failed", messages));
    }
    console.log("Error verifying OTP: ", error);
    return next(new ApiError(500, "Unexprected error occurred", error));
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  if (req.user?._id) {
    const token = generateAuthToken(req.user._id);
    res.status(200).json(
      new ApiResponse(200, "User Authenticated", true, {
        user: {
          userId: req.user?._id,
          email: req.user?.email,
          name: req.user?.name,
          profilePic: req.user?.profilePic,
        },
        token,
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

function generateAuthToken(userId: Types.ObjectId): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
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
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: Types.ObjectId };

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

    const authToken = generateAuthToken(user._id);
    if (isNativeRequest(req)) {
      // For Capacitor native, redirect to deep link so App can capture token via appUrlOpen
      return res.redirect(`capacitor://localhost/dashboard?token=${authToken}`);
    }
    res.redirect(`${env.CLIENT_URL}/dashboard?token=${authToken}`);
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
    // Also block JWT if provided (native apps use JWT, not cookies)
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        await blockJWT(token);
      } catch (_) {
        // ignore block errors
      }
    }

    if (req.session) {
      req.session.destroy((error) => {
        if (error) {
          return next(
            new ApiError(500, "Failed to destroy session", [error.message]),
          );
        }
        res.clearCookie("connect.sid", { path: "/" });
        return res
          .status(200)
          .json(new ApiResponse(200, "User logged out successfully"));
      });
    } else {
      res.clearCookie("connect.sid", { path: "/" });
      return res
        .status(200)
        .json(new ApiResponse(200, "User logged out successfully"));
    }
  } catch (error: any) {
    return next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unexpcted error during logout", error),
    );
  }
}

export async function googleOAuthCallback(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (!req.user) {
    return res.redirect(`${env.CLIENT_URL}/signin`);
  }
  const authToken = generateAuthToken(req.user._id);
  if (isNativeRequest(req)) {
    return res.redirect(`capacitor://localhost/dashboard?token=${authToken}`);
  }
  return res.redirect(`${env.CLIENT_URL}/dashboard?token=${authToken}`);
}

export async function githubOAuthCallback(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (!req.user) {
    return res.redirect(`${env.CLIENT_URL}/signin`);
  }
  const authToken = generateAuthToken(req.user._id);
  if (isNativeRequest(req)) {
    return res.redirect(`capacitor://localhost/dashboard?token=${authToken}`);
  }
  return res.redirect(`${env.CLIENT_URL}/dashboard?token=${authToken}`);
}

export function googleOAuth(_req: Request, res: Response) {
  res.status(200).json(new ApiResponse(200, "User Signin with Google", true));
}

export function githubOAuth(_req: Request, res: Response) {
  res.status(200).json(new ApiResponse(200, "User Signin with Github", true));
}
