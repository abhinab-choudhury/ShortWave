import mongoose, { model, Schema } from "mongoose";
import { IClick } from "../../interfaces/models";

const ClickSchema = new Schema<IClick>(
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

export const Click = model<IClick>("Click", ClickSchema);
