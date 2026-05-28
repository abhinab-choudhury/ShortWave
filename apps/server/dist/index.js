"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const secret_1 = require("./utils/secret");
const db_connect_1 = __importStar(require("./database/db-connect"));
const redis_connect_1 = require("./database/redis-connect");
const user_services_1 = require("./services/user.services");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const campaign_route_1 = __importDefault(require("./routes/campaign.route"));
const url_route_1 = __importDefault(require("./routes/url.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const redirect_route_1 = __importDefault(require("./routes/redirect.route"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const node_path_1 = __importDefault(require("node:path"));
const redis_helpers_1 = require("./utils/redis-helpers");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", node_path_1.default.join(__dirname, "views"));
app.use((0, cors_1.default)({
    origin: secret_1.env.CLIENT_URL,
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: secret_1.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: "none", // not-recommended for real world usercase ❌❌❌
        secure: secret_1.env.NODE_ENV === "production", // only over HTTPS
        httpOnly: true,
        // domain: env.NODE_ENV === "production" ? ".vercel.app" : undefined,
    },
    store: connect_mongo_1.default.create({
        mongoUrl: db_connect_1.MONGODB_URI,
        collectionName: "sessions",
        ttl: 14 * 24 * 60 * 60, // 14 days
        autoRemove: "native",
    }),
}));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use((0, morgan_1.default)(secret_1.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_services_1.getUserById)(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
app.get("/", (_req, res) => {
    res.render("index", {
        title: "Shortwave | Rest API Server",
        year: new Date().getFullYear(),
    });
});
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/campaign", campaign_route_1.default);
app.use("/api/v1/url", url_route_1.default);
app.use("/api/v1/user", user_route_1.default);
app.use("/cron/flush", redis_helpers_1.flushRedishStatsToMongo);
app.use("/", redirect_route_1.default);
app.use(error_middleware_1.default);
(0, db_connect_1.default)()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_connect_1.REDIS_CONNECT)();
    app.listen(secret_1.env.PORT, () => {
        console.log(`Server running at http://localhost:${secret_1.env.PORT}`);
    });
}))
    .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
});
