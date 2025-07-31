import BlockJWT from "../database/models/blockjwt.model";
import { IBlockJWT } from "../interfaces/model";

/**
 * Added the JWT Token to the block list after
 * beign used for once.
 * */
export async function blockJWT(jwt: string): Promise<IBlockJWT> {
  const response = new BlockJWT({
    jwt,
  });
  return await response.save();
}

/**
 * Finds the JWT token, if it is already
 * add to block-list, which means which, JWT Token
 * is already used.
 * */
export async function findBlockedJWT(jwt: string): Promise<IBlockJWT | null> {
  return await BlockJWT.findOne({ jwt });
}
