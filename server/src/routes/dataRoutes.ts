import express from 'express';
import { exportData, importData, resetData } from '../controllers/dataController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/export', requireAuth, exportData);
router.post('/import', requireAuth, importData);
router.post('/reset', requireAuth, resetData);

export default router;
