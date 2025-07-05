import mongoose, { Connection } from "mongoose";
import { env } from "../utils/secret";

export const MONGODB_URI = `${env.MONGODB_BASE_URI}/${env.DATABASE_NAME}`;
const DB_CONNECT = async (): Promise<Connection> => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI);
    console.log(
      "Connection to DB successfully",
      connectionInstance.connection.port,
    );

    return connectionInstance.connection;
  } catch (error) {
    console.log("Connection Error :", error);
    process.exit(1);
  }
};

export default DB_CONNECT;
