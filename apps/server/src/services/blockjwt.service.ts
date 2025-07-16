import BlockJWT from "../database/models/blockjwt.model";
import { IBlockJWT } from "../interfaces/model";

export async function blockJWT(jwt: string): Promise<IBlockJWT> {
  const response = new BlockJWT({
    jwt,
  });
  return await response.save();
}

export async function findBlockedJWT(jwt: string): Promise<IBlockJWT | null> {
  return await BlockJWT.findOne({ jwt });
}
