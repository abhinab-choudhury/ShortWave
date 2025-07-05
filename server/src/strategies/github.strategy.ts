import passport from "passport";
import { Strategy as GithubStrategy, Profile } from "passport-github2";
import oauth2 from "passport-oauth2";
import { env } from "../utils/secret";
import { createUser, getUserByAuthProviderId } from "../services/user.services";
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
        if (!user) {
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
        } else {
          cb(null, user);
        }
      } catch (error) {
        cb(error, false);
      }
    },
  ),
);
