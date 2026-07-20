import express from 'express';
import authRoutes from './auth.routes.js';
import inquiryRoutes from './inquiry.routes.js';
import solutionRoutes from './solution.routes.js';
import projectRoutes from './project.routes.js';
import articleRoutes from './article.routes.js';
import eventRoutes from './event.routes.js';
import galleryRoutes from './gallery.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import chatRoutes from './chat.routes.js';
import logRoutes from './log.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/solutions', solutionRoutes);
router.use('/projects', projectRoutes);
router.use('/articles', articleRoutes);
router.use('/events', eventRoutes);
router.use('/gallery', galleryRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chat', chatRoutes);
router.use('/', logRoutes);

export default router;
