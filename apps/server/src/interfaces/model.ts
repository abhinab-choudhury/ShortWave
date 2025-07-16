import { Document } from "mongoose";

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export interface IBlockJWT extends Document {
  jwt: string;
}

export interface IUser extends Document {
  email: string;
  authProviders?: IAuthProvider[];
  name: string;
  profilePic?: string;
  admin: boolean;
}

export interface ICampaign extends Document {
  name: string;
  description: string;
  user: IUser["_id"];
}

export interface ILocation extends Document {
  user_id: IUser["_id"];
  url_id: IUrl["_id"];
  ip: string;
  click: IClick["_id"];
}

export interface IUrl extends Document {
  user_id: IUser["_id"];
  campaign_id: ICampaign["_id"];
  original_url: string;
  short_url: string;
  qr_code_path: string;
  expire_at: Date;
  active: boolean;
}

export interface IClick extends Document {
  user_id: IUser["_id"];
  url_id: IUrl["_id"];
  click_cnt: number;
  device_list: Array<IDevice["_id"]>;
  location_list: Array<ILocation["_id"]>;
}

export interface IDevice extends Document {
  user_id: IUser["_id"];
  url_id: IUrl["_id"];
  click: IClick["_id"];
  mobile: number;
  tablet: number;
  desktop: number;
  windows: number;
  mac: number;
  linux: number;
  other: number;
}
