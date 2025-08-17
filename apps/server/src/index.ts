import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";

import { env } from "./utils/secret";
import DB_CONNECT, { MONGODB_URI } from "./database/db-connect";
import { REDIS_CONNECT } from "./database/redis-connect";
import { getUserById } from "./services/user.services";
import authRoute from "./routes/auth.route";
import campaignRoute from "./routes/campaign.route";
import urlRoute from "./routes/url.route";
import userRoute from "./routes/user.route";
import redirectRoute from "./routes/redirect.route";
import globalErrorHandler from "./middlewares/error.middleware";
import path from "node:path";
import { flushRedishStatsToMongo } from "./utils/redis-helpers";

const app = express();

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: env.NODE_ENV !== "development",
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
      autoRemove: "native",
    }),
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user: Express.User, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.get("/", (_req, res) => {
  res.render("index", {
    title: "Shortwave | Rest API Server",
    year: new Date().getFullYear(),
  });
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/campaign", campaignRoute);
app.use("/api/v1/url", urlRoute);
app.use("/api/v1/user", userRoute);
app.use("/cron-job", flushRedishStatsToMongo);
app.use("/", redirectRoute);
app.use(globalErrorHandler);

DB_CONNECT()
  .then(async () => {
    await REDIS_CONNECT();
    app.listen(env.PORT, () => {
      console.log(`Server running at http://localhost:${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
