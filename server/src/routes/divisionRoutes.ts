import express from 'express';
import { getDivisions, createDivision, updateDivision, deleteDivision } from '../controllers/divisionController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', getDivisions);
router.post('/', requireAuth, createDivision);
router.put('/:id', requireAuth, updateDivision);
router.delete('/:id', requireAuth, deleteDivision);

export default router;
