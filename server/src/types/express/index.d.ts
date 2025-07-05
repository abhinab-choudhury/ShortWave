import { IUser } from "../../interfaces/model";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
