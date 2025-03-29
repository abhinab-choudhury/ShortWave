import mongoose, { model, Schema } from "mongoose";
import { IDevice } from "../../interfaces/models";

const DeviceSchema = new Schema<IDevice>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },
    click: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Click",
      require: true,
    },
    tablet: {
      type: Number,
      default: 0,
    },
    desktop: {
      type: Number,
      default: 0,
    },
    mobile: {
      type: Number,
      default: 0,
    },
    windows: {
      type: Number,
      default: 0,
    },
    mac: {
      type: Number,
      default: 0,
    },
    linux: {
      type: Number,
      default: 0,
    },
    other: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Device = model<IDevice>("c", DeviceSchema);
