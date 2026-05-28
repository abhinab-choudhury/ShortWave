import User from "../database/models/user.model";
import { IAuthProvider, IUser } from "../interfaces/model";

/*
 * Fetch User with a specific authProviderId from the database
 */
export async function getUserByAuthProviderId(
  authProviderId: IAuthProvider["providerId"],
): Promise<IUser | null> {
  return await User.findOne({
    authProviders: {
      $elemMatch: {
        providerId: authProviderId,
      },
    },
  });
}

/*
 * Fetch user by their id from the database
 */
export async function getUserById(id: IUser["_id"]): Promise<null | IUser> {
  return await User.findById(id);
}

/*
 * Fetch user by their email from the database
 */
export async function getUserByEmail(
  email: IUser["email"],
): Promise<IUser | null> {
  return await User.findOne({ email });
}

/*
 * Creates a new user in the database
 */
export async function createUser(
  data: Pick<IUser, "email" | "name" | "admin"> & Partial<Pick<IUser, "authProviders" | "profilePic">>,
): Promise<IUser> {
  const user = new User(data);
  return await user.save();
}

/*
 * Change username
 */
export async function changeUsername(
  userId: IUser["_id"],
  data: Pick<IUser, "name">,
): Promise<IUser | null> {
  return await User.findByIdAndUpdate(
    userId,
    { name: data.name },
    { new: true },
  );
}
