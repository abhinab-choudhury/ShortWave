import mongoose, { model, Schema } from "mongoose";
import { ILocation } from "../../interfaces/models";

const LocationSchema = new Schema<ILocation>(
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
  },
  {
    timestamps: true,
  },
);

export const Location = model<ILocation>("Location", LocationSchema);
