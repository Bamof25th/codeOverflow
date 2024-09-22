import mongoose from "mongoose";

let isConnected: boolean = false;

export const ConnectToDataBase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("missing mongo db url");
  }
  if (isConnected) {
    console.log("MongoDb is connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "codeflow",
    });
    isConnected = true;

    console.log(" Mongo Db is already connected");
  } catch (error) {
    console.log("MongoDB Connection fail", error);
  }
};
