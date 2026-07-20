import express from 'express';
import { getProjects, addProject, editProject, deleteProject } from '../controllers/project.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', auth, addProject);
router.put('/:id', auth, editProject);
router.delete('/:id', auth, deleteProject);

export default router;
