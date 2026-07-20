import express from 'express';
import {
  getLoginLogs,
  getChatbotLogs,
  getEnquiryReports,
  createEnquiryReport,
  deleteEnquiryReport
} from '../controllers/log.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/logs/login', auth, getLoginLogs);
router.get('/logs/chatbot', auth, getChatbotLogs);
router.get('/reports/enquiries', auth, getEnquiryReports);
router.post('/reports/enquiries', auth, createEnquiryReport);
router.delete('/reports/enquiries/:id', auth, deleteEnquiryReport);

export default router;
