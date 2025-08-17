import { Document } from "mongoose";

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export interface ICountry {
  country_name: string;
  count: number;
}

export interface IDevice {
  device_name: string;
  count: number;
}

export interface IOS {
  os_name: string;
  count: number;
}

export interface IBrowser {
  browser_name: string;
  count: number;
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

export interface IUrl extends Document {
  user_id: IUser["_id"];
  campaign_id: ICampaign["_id"];
  original_url: string;
  short_url: string;
  from_date?: Date;
  to_date?: Date;
}

export interface IClick extends Document {
  short_url: IUrl["short_url"];
  date: string;
  click_cnt: number;
  device: Array<IDevice>;
  country: Array<ICountry>;
  os: Array<IOS>;
  browser: Array<IBrowser>;
}
