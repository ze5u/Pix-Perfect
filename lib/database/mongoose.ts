import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

const cached: MongooseConnection =
  global.mongoose as MongooseConnection || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) {
    throw new Error(
      "Missing MONGODB_URL. Copy .env.example to .env and set the Atlas URI, then restart."
    );
  }

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URL, {
        dbName: "pixperfect",
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error(
      "Could not connect to MongoDB. Check MONGODB_URL in .env."
    );
  }
};
