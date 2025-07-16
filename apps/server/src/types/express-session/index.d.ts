import "express-session";
import { IUser } from "../../interfaces/model";

declare module "express-session" {
  interface SessionData {
    userId: IUser["_id"];
    email?: IUser["email"];
  }
}
