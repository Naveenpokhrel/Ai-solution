import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
  try {
    if (!config.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is missing.");
      process.exit(1);
    }
    await mongoose.connect(config.MONGODB_URI);
    console.log('Successfully connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('\n========================================================================');
      console.error('CRITICAL ERROR: Could not connect to any servers in your MongoDB Atlas cluster.');
      console.error('One common reason is that your current IP address is not whitelisted.');
      console.error('Please whitelist your current public IP address in your MongoDB Atlas dashboard:');
      console.error('https://cloud.mongodb.com/ -> Network Access -> Add IP Address');
      console.error('========================================================================\n');
    }
    process.exit(1);
  }
};
