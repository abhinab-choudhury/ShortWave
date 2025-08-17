import mongoose from "mongoose";
import { IClick } from "../../interfaces/model";

const ClickSchema = new mongoose.Schema<IClick>(
  {
    short_url: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    click_cnt: {
      type: Number,
      required: true,
    },
    device: [
      {
        device_name: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    country: [
      {
        country_name: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    os: [
      {
        os_name: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    browser: [
      {
        browser_name: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Click = mongoose.model<IClick>("Click", ClickSchema);
export default Click;
