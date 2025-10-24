import mongoose from 'mongoose';
import { Falha } from '../models/Falha.js';


export async function connectDB(uri = process.env.MONGODB_URI) {
  mongoose.set('strictQuery', true);
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }
  await mongoose.connect(uri, { dbName: 'cadeiras' });
  console.log('✅ MongoDB conectado');
}
