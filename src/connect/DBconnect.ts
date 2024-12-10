import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DB_CONN_STRING || "";

const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};


export const conDB = async () => {
    try {
        await mongoose.connect(uri, options);
        console.log('MongoDB conectado');
      } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
      }
}
