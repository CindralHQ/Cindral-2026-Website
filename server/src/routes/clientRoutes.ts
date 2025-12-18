import express from 'express';
import {
    getClientProjects, createClientProject, updateClientProject, deleteClientProject,
    getClientInvoices, createClientInvoice, updateClientInvoice, deleteClientInvoice,
    getClientUsers, createClientUser, updateClientUser, deleteClientUser
} from '../controllers/clientController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Client Projects
router.get('/client-projects', getClientProjects); // Public? Original was public (no requireAuth)
router.post('/client-projects', requireAuth, createClientProject);
router.put('/client-projects/:id', requireAuth, updateClientProject);
router.delete('/client-projects/:id', requireAuth, deleteClientProject);

// Client Invoices
router.get('/client-invoices', getClientInvoices); // Public? Original was public
router.post('/client-invoices', requireAuth, createClientInvoice);
router.put('/client-invoices/:id', requireAuth, updateClientInvoice);
router.delete('/client-invoices/:id', requireAuth, deleteClientInvoice);

// Client Users
router.get('/client-users', requireAuth, getClientUsers);
router.post('/client-users', requireAuth, createClientUser);
router.put('/client-users/:id', requireAuth, updateClientUser);
router.delete('/client-users/:id', requireAuth, deleteClientUser);

export default router;
