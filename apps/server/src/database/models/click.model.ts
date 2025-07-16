import mongoose from "mongoose";
import { IClick } from "../../interfaces/model";

const ClickSchema = new mongoose.Schema<IClick>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    url_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
    },
    device_list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
    location_list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    ],
    click_cnt: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Click = mongoose.model<IClick>("Click", ClickSchema);
export default Click;
