import express from 'express';
import { getInitiatives, createInitiative, updateInitiative, deleteInitiative } from '../controllers/initiativeController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', getInitiatives);
router.post('/', requireAuth, createInitiative);
router.put('/:id', requireAuth, updateInitiative);
router.delete('/:id', requireAuth, deleteInitiative);

export default router;
