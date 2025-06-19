// models/User.ts

import mongoose from "mongoose";
import { IUser } from "../../interfaces/models";

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    authProvider: {
      type: String,
      enum: ["google", "github"],
      require: false,
    },
    authProviderId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    profilePic: {
      type: String,
      trim: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      unqiue: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
