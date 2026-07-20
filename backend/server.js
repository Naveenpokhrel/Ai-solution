import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { connectDB } from './config/db.js';
import apiRouter from './routes/index.js';

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Start Server
app.listen(config.PORT, () => {
  console.log(`Express API Server listening on port ${config.PORT}`);
});
