import mongoose, { Mongoose } from 'mongoose';

// Typage explicite et validation
const MONGODB_URI: string = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error('MONGODB_URI must be defined');

// Accès type-safe à global
const globalWithMongoose = global as typeof globalThis & {
  mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
};

// Initialisation du cache
let cached = globalWithMongoose.mongoose;
if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then(m => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;