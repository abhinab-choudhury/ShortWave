import mongoose from "mongoose";
import { IBlockJWT } from "../../interfaces/model";

const blockJWTSchema = new mongoose.Schema<IBlockJWT>(
  {
    jwt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const BlockJWT = mongoose.model("BlockJWT", blockJWTSchema);
export default BlockJWT;
