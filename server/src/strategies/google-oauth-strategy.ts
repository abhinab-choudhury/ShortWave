import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../utils/secrets";
import { User } from "../database/models/user.models";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await User.findOne({ authProviderId: profile.id });
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            authProvider: "gooogle",
            authProviderId: profile.id,
            name: profile.username!,
            profile_pic: profile.photos[0].value,
            admin: false,
            refreshToken: refreshToken,
          });
          console.log("Access Token: " + accessToken + "\nRefresh Token: " + refreshToken);
          await sendWelcomeEmail({ username:profile.username, email:profile.emails[0].value });
        }
        cb(null, user);
      } catch (error) {
        cb(error, false);
      }
    },
  ),
);

passport.serializeUser((user:Express.User, cb) => {
  cb(null, user);
});

passport.deserializeUser((user:Express.User, cb) => {
  cb(null, user);
});
