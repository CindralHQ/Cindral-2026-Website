import express from 'express';
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', getTeam);
router.post('/', requireAuth, createTeamMember);
router.put('/:id', requireAuth, updateTeamMember);
router.delete('/:id', requireAuth, deleteTeamMember);

export default router;
