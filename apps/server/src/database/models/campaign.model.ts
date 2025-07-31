import mongoose from "mongoose";
import { ICampaign } from "../../interfaces/model";

const campaignSchema = new mongoose.Schema<ICampaign>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
