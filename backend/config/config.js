import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'ai_solutions_default_secret_key',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY
};
