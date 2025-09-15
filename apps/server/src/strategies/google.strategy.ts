import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import oauth2 from "passport-oauth2";
import { env } from "../utils/secret";
import {
  createUser,
  getUserByAuthProviderId,
  getUserByEmail,
} from "../services/user.services";
import { IUser } from "../interfaces/model";
import { sendWelcomeEmail } from "../utils/email";

passport.use(
  "google-strategy",
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_URL}/api/v1/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async function (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      cb: oauth2.VerifyCallback,
    ) {
      try {
        let user = await getUserByAuthProviderId(profile.id);

        if (user) {
          user.name = profile.displayName || user.name;
          user.profilePic = profile.photos?.[0]?.value || user.profilePic;
          await user.save();

          return cb(null, user);
        }

        const email = profile.emails?.[0]?.value;
        if (!email) {
          return cb(new Error("Google account has no email associated"), false);
        }

        let existingUser = await getUserByEmail(email); // implement this in services
        if (existingUser) {
          if (
            !existingUser.authProviders.some((p) => p.provider === "google")
          ) {
            existingUser.authProviders.push({
              provider: "google",
              providerId: profile.id,
            });
          }

          existingUser.name = profile.displayName || existingUser.name;
          existingUser.profilePic =
            profile.photos?.[0]?.value || existingUser.profilePic;

          await existingUser.save();
          return cb(null, existingUser);
        }

        let newUser: Pick<
          IUser,
          "email" | "authProviders" | "name" | "profilePic" | "admin"
        > = {
          email,
          authProviders: [
            {
              provider: "google",
              providerId: profile.id,
            },
          ],
          name: profile.displayName,
          profilePic: profile.photos?.[0]?.value!,
          admin: false,
        };

        let response = await createUser(newUser);
        await sendWelcomeEmail(response?.name!, response?.email!);

        return cb(null, response!);
      } catch (error) {
        cb(error, false);
      }
    },
  ),
);
