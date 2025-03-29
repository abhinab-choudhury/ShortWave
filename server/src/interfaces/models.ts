import { ObjectId, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  googleId: string;
  githubId: string;
  name: string;
  profile_pic: string;
  admin: boolean;
}

export interface ILocation extends Document {
  user_id: ObjectId;
  url_id: ObjectId;
  ip: string;
  click: ObjectId;
}

export interface IUrl extends Document {
  user_id: IUser["_id"]; // refers to a users _id
  original_url: string;
  short_url: string;
  qr_code_path: string; // qr_code stored path,
  expire_at: Date;
  active: boolean;
}

export interface IClick extends Document {
  user_id: ObjectId;
  url_id: ObjectId;
  click_cnt: number;
  device_list: Array<ObjectId>;
  location_list: Array<ObjectId>;
}

export interface IDevice extends Document {
  user_id: ObjectId;
  url_id: ObjectId;
  click: ObjectId;
  mobile: number;
  tablet: number;
  desktop: number;
  windows: number;
  mac: number;
  linux: number;
  other: number;
}
