import express, { Application } from "express";
// import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import session from "express-session";
import cors, { CorsOptions } from "cors";
import DB_CONNECT from "./database/db-connect";
import {
  CLIENT_URL,
  MONGODB_CONNECTION_STRING,
  PORT,
  SESSION_SECRET,
} from "./utils/secrets";
import authRoute from "./routes/auth-routes";
import MongoStore from "connect-mongo";
import passport from "passport";

const app: Application = express();
const corsOptions: CorsOptions = {
  origin: [CLIENT_URL as string],
  credentials: true, // Allow credentials (cookies, authentication headers)
};
const sessionOptions = {
  secret: [SESSION_SECRET as string],
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: MONGODB_CONNECTION_STRING,
    collectionName: "sessions",
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
};

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

DB_CONNECT().then((): void => {
  app.get("/health", (_, res) => {
    res.send("I am healthy");
  });
  app.use("/api/v1/auth", authRoute);
});

app.listen(PORT || 8080, () => {
  console.log(`Server Running on http://localhost:${process.env.PORT || 8080}`);
});
