import mongoose from "mongoose";
import { IDevice } from "../../interfaces/model";

const DeviceSchema = new mongoose.Schema<IDevice>(
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
      required: true,
    },
    device: {
      type: String,
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Device = mongoose.model<IDevice>("Device", DeviceSchema);
export default Device;
