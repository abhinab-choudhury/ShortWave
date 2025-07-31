import mongoose from "mongoose";
import { IClickLog } from "../../interfaces/model";

const ClickLogSchema = new mongoose.Schema<IClickLog>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    requied: true,
  },
  data: {
    type: Date,
    required: true,
  },
  click_cnt: {
    type: Number,
    required: true,
    default: 1,
  },
});

const ClickLog = mongoose.model<IClickLog>("ClickLog", ClickLogSchema);
export default ClickLog;
