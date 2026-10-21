import mongoose, { Connection } from "mongoose";
import { env } from "../utils/secret";

export const MONGODB_URI = `${env.MONGODB_BASE_URI}/${env.DATABASE_NAME}?retryWrites=true`;

// One pool per warm instance, reused by every request. A client per request would
// pay a fresh TCP + TLS handshake on every redirect.
let connectionPromise: Promise<Connection> | null = null;

const DB_CONNECT = async (): Promise<Connection> => {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(MONGODB_URI, {
        maxPoolSize: 5, // serverless: Mongoose defaults to 100 sockets per instance
        minPoolSize: 1,
        maxIdleTimeMS: 60_000,
        serverSelectionTimeoutMS: 10_000, // a cold instance needs a few seconds
        connectTimeoutMS: 10_000,
      })
      .then((m) => {
        console.log("Connection to DB successfully", m.connection.port);
        return m.connection;
      })
      .catch((error) => {
        connectionPromise = null; // let the next invocation retry
        throw error;
      });
  }
  return connectionPromise;
};

export default DB_CONNECT;
