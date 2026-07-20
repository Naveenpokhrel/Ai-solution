import express from 'express';
import { getTestimonials, addTestimonial, editTestimonial, deleteTestimonial } from '../controllers/testimonial.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', addTestimonial);
router.put('/:id', auth, editTestimonial);
router.delete('/:id', auth, deleteTestimonial);

export default router;
