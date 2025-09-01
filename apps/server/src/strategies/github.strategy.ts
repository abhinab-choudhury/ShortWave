import passport from "passport";
import { Strategy as GithubStrategy, Profile } from "passport-github2";
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
  "github-strategy",
  new GithubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: `${env.SERVER_URL}/api/v1/auth/github/callback`,
      scope: ["read:user", "user:email"],
    },
    async function (
      _accessToken: string,
      _refeshToken: string,
      profile: Profile,
      cb: oauth2.VerifyCallback,
    ) {
      try {
        const user = await getUserByAuthProviderId(profile.id);

        if (user) {
          user.name = profile.displayName || user.name;
          user.profilePic = profile.photos?.[0]?.value || user.profilePic;
          await user.save();

          return cb(null, user);
        }

        const email = profile.emails?.[0]?.value;
        if (!email) {
          return cb(new Error("Github account has no email associated"), false);
        }
        let existingUser = await getUserByEmail(email);
        if (existingUser) {
          if (
            !existingUser.authProviders.some((p) => p.provider === "github")
          ) {
            existingUser.authProviders.push({
              provider: "github",
              providerId: profile.id,
            });
          }

          existingUser.name = profile.displayName || existingUser.name;
          existingUser.profilePic =
            profile.photos?.[0]?.value || existingUser.profilePic;

          await existingUser.save();
          return cb(null, existingUser);
        }
        const newUser: Pick<
          IUser,
          "email" | "authProviders" | "name" | "profilePic" | "admin"
        > = {
          email: profile.emails?.[0]?.value!,
          authProviders: [
            {
              provider: "github",
              providerId: profile.id,
            },
          ],
          name: profile.displayName,
          profilePic: profile.photos?.[0]?.value!,
          admin: false,
        };
        const response = await createUser(newUser);
        await sendWelcomeEmail(response?.name!, response?.email!);

        cb(null, response);
      } catch (error) {
        cb(error, false);
      }
    },
  ),
);
