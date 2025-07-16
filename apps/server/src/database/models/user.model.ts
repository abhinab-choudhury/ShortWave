import mongoose from "mongoose";
import { IUser } from "../../interfaces/model";

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    authProviders: [
      {
        provider: {
          type: String,
          enum: ["google", "github"],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
      },
    ],
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
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
