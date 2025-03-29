import mongoose, { model, Schema } from "mongoose";
import { IUrl } from "../../interfaces/models";

const UrlSchema = new Schema<IUrl>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    original_url: {
      type: String,
      required: true,
      trim: true,
    },
    short_url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    expire_at: {
      type: Date,
    },
    qr_code_path: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Url = model<IUrl>("Url", UrlSchema);
