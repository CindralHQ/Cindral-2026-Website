import express from 'express';
import { login, logout } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.post('/logout', requireAuth, logout);

export default router;
