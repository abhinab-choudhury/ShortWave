import { model, Schema } from "mongoose";
import { IUser } from "../../interfaces/models";

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      unique: true,
      trim: true,
    },
    githubId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    profile_pic: {
      type: String,
      trim: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", UserSchema);
