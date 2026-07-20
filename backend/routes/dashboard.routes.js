import express from 'express';
import { getAnalytics } from '../controllers/dashboard.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics', auth, getAnalytics);

export default router;
