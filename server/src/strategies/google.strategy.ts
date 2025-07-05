import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import oauth2 from "passport-oauth2";
import { env } from "../utils/secret";
import { createUser, getUserByAuthProviderId } from "../services/user.services";
import { IUser } from "../interfaces/model";
import { sendWelcomeEmail } from "../utils/email";

passport.use(
  "google-strategy",
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_URL}/api/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async function (
      _accessToken: string,
      _refeshToken: string,
      profile: Profile,
      cb: oauth2.VerifyCallback,
    ) {
      try {
        let user = await getUserByAuthProviderId(profile.id);

        // Auth Login Error instead of createing user
        // we should update is the user with these
        // redenditals exits or create a new user
        // YYEEET to IMPLEMENT!!!!!!!!!!!

        if (!user) {
          let newUser: Pick<
            IUser,
            "email" | "authProviders" | "name" | "profilePic" | "admin"
          > = {
            email: profile.emails?.[0]?.value!,
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

          cb(null, response!);
        } else {
          cb(null, user);
        }
      } catch (error) {
        cb(error, false);
      }
    },
  ),
);
