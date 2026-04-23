import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }else{
    console.log('Connecting to MongoDB...');
  }

  await mongoose.connect(env.mongoUri);
}
