import express from 'express';
import { createContactSubmission, getContactSubmissions, updateContactSubmission, deleteContactSubmission } from '../controllers/contactController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/contact', createContactSubmission);
router.get('/contact-submissions', requireAuth, getContactSubmissions);
router.put('/contact-submissions/:id', requireAuth, updateContactSubmission);
router.delete('/contact-submissions/:id', requireAuth, deleteContactSubmission);

export default router;
