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
    from_date: {
      type: Date,
      required: false,
    },
    to_date: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Url = mongoose.model<IUrl>("Url", UrlSchema);
export default Url;
