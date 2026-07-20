import express from 'express';
import { getGallery, addGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', auth, addGalleryItem);
router.delete('/:id', auth, deleteGalleryItem);

export default router;
