import mongoose from "mongoose";
import { IClick } from "../../interfaces/model";

const ClickSchema = new mongoose.Schema<IClick>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
    },
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    click_log: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClickLog",
    },
  },
  {
    timestamps: true,
  },
);

const Click = mongoose.model<IClick>("Click", ClickSchema);
export default Click;
