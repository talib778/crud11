import mongoose from "mongoose";
import dotenv from 'dotenv';

let isConnected = false; // Track the connection state
dotenv.config(); // Load environment variables

let url = process.env.MONGO_URL; // Database URL from environment variables

async function connectdb() {
    if (isConnected) return; // Exit if already connected

    try {
        await mongoose.connect(url);
        isConnected = true; // Mark the connection as established
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

export default connectdb;
