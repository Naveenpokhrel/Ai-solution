import express from 'express';
import { getEvents, addEvent, editEvent, deleteEvent } from '../controllers/event.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', auth, addEvent);
router.put('/:id', auth, editEvent);
router.delete('/:id', auth, deleteEvent);

export default router;
