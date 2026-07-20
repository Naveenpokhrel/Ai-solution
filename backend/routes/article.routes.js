import express from 'express';
import { getArticles, getArticleById, addArticle, editArticle, deleteArticle } from '../controllers/article.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/', auth, addArticle);
router.put('/:id', auth, editArticle);
router.delete('/:id', auth, deleteArticle);

export default router;
