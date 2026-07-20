import express from 'express';
import { submitInquiry, getInquiries, getInquiryById, deleteInquiry } from '../controllers/inquiry.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitInquiry);
router.get('/', auth, getInquiries);
router.get('/:id', auth, getInquiryById);
router.delete('/:id', auth, deleteInquiry);

export default router;
