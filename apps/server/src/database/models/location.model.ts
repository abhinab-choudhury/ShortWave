import mongoose from "mongoose";
import { ILocation } from "../../interfaces/model";

const LocationSchema = new mongoose.Schema<ILocation>(
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
    ip: {
      type: String,
      unique: true,
      required: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Location = mongoose.model<ILocation>("Location", LocationSchema);
export default Location;
