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
  authProviders?: Array<IAuthProvider>;
  name: string;
  profilePic?: string;
  admin: boolean;
}

export interface ICampaign extends Document {
  user_id: IUser["_id"];
  name: string;
  description: string;
}

export interface ILocation extends Document {
  user_id: IUser["_id"];
  url_id: IUrl["_id"];
  click: IClick["_id"];
  ip: string;
  country: string;
}

export interface IUrl extends Document {
  user_id: IUser["_id"];
  campaign_id: ICampaign["_id"];
  original_url: string;
  short_url: string;
  from_date?: Date;
  to_date?: Date;
}

export interface IClickLog extends Document {
  user_id: IUser["_id"];
  url_id: IUrl["_id"];
  data: Date;
  click_cnt: number;
}

export interface IClick extends Document {
  user_id: IUser["_id"];
  url_id: IUrl["_id"];
  device_id: IDevice["_id"];
  location_id: ILocation["_id"];
  click_log: IClickLog["_id"];
}

export interface IDevice extends Document {
  user_id: IUser["_id"];
  url_id: IUrl["_id"];
  click: IClick["_id"];
  device: string;
  os: string;
  browser: string;
}
