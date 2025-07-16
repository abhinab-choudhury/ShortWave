import mongoose from "mongoose";
import { IUrl } from "../../interfaces/model";

const UrlSchema = new mongoose.Schema<IUrl>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
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

const Url = mongoose.model<IUrl>("Url", UrlSchema);
export default Url;
