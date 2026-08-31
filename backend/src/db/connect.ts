import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryReads: true,
      retryWrites: true,
    };

    const connectionInstance = await mongoose.connect(
      `${Bun.env.MONGO_URI}/${Bun.env.DB_NAME}`,
      options,
    );
    console.log(
      "Database Connection Successfull!",
      "Host:",
      connectionInstance.connection.host,
    );
  } catch (error) {
    console.error("Database Connection Failed!", error);
    process.exit(1);
  }
};
