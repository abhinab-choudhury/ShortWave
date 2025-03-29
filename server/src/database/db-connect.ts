import mongoose, { Connection } from "mongoose";
import { MONGODB_CONNECTION_STRING } from "../utils/secrets";

const DB_CONNECT = async (): Promise<Connection> => {
  console.log("Connection String :", MONGODB_CONNECTION_STRING);
  try {
    const connectionInstance = await mongoose.connect(
      MONGODB_CONNECTION_STRING,
    );
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
