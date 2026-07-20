import express from 'express';
import { getSolutions, addSolution, editSolution, deleteSolution } from '../controllers/solution.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSolutions);
router.post('/', auth, addSolution);
router.put('/:id', auth, editSolution);
router.delete('/:id', auth, deleteSolution);

export default router;
