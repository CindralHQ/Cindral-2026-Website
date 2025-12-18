import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import ClientProject from '../models/ClientProject';
import ClientInvoice from '../models/ClientInvoice';
import ClientUser from '../models/ClientUser';
import { ClientProject as IClientProject } from '../../../types';

const computeProgressFromTasks = (tasks?: IClientProject['tasks']) => {
    if (!tasks || tasks.length === 0) return 0;
    const done = tasks.filter(t => t.status === 'done').length;
    return Math.round((done / tasks.length) * 100);
};

// Client Projects
export const getClientProjects = async (_req: Request, res: Response) => {
    try {
        const projects = await ClientProject.find();
        const withProgress = projects.map(cp => {
            const obj = cp.toObject();
            return {
                ...obj,
                progress: computeProgressFromTasks(obj.tasks) || obj.progress || 0
            };
        });
        res.json(withProgress);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createClientProject = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload.name || !payload.projectId) {
            return res.status(400).json({ message: 'Name and projectId are required' });
        }

        const newProject = new ClientProject({
            id: payload.id || `client_proj_${Date.now()}`,
            projectId: payload.projectId,
            clientName: payload.clientName || payload.name,
            name: payload.name,
            summary: payload.summary,
            status: payload.status,
            health: payload.health,
            progress: computeProgressFromTasks(payload.tasks) || 0,
            budgetUsed: payload.budgetUsed,
            startDate: payload.startDate,
            endDate: payload.endDate,
            nextMilestone: payload.nextMilestone,
            team: payload.team,
            resources: payload.resources,
            tasks: payload.tasks,
            timeline: payload.timeline,
            updates: payload.updates,
            links: payload.links
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateClientProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        // If tasks are updated, recompute progress
        if (payload.tasks) {
            payload.progress = computeProgressFromTasks(payload.tasks);
        }

        const project = await ClientProject.findOneAndUpdate({ id }, payload, { new: true });
        if (!project) {
            return res.status(404).json({ message: 'Client project not found' });
        }

        // Ensure progress is accurate in response
        const obj = project.toObject();
        obj.progress = computeProgressFromTasks(obj.tasks) || obj.progress || 0;

        res.json(obj);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteClientProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ClientProject.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: 'Client project not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Client Invoices
export const getClientInvoices = async (_req: Request, res: Response) => {
    try {
        const invoices = await ClientInvoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createClientInvoice = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload.projectId || !payload.amount || !payload.currency || !payload.issuedOn || !payload.dueOn) {
            return res.status(400).json({ message: 'projectId, amount, currency, issuedOn, and dueOn are required' });
        }

        const invoice = new ClientInvoice({
            id: payload.id || `inv_${nanoid(8)}`,
            projectId: payload.projectId,
            amount: payload.amount,
            currency: payload.currency,
            status: payload.status,
            issuedOn: payload.issuedOn,
            dueOn: payload.dueOn,
            description: payload.description,
            downloadUrl: payload.downloadUrl
        });

        const savedInvoice = await invoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateClientInvoice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const invoice = await ClientInvoice.findOneAndUpdate({ id }, payload, { new: true });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteClientInvoice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ClientInvoice.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Client Users
export const getClientUsers = async (_req: Request, res: Response) => {
    try {
        const users = await ClientUser.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createClientUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload.name || !payload.email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const user = new ClientUser({
            id: payload.id || `client_${nanoid(8)}`,
            name: payload.name,
            email: payload.email,
            company: payload.company,
            role: payload.role,
            allowedProjectIds: payload.allowedProjectIds
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateClientUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const user = await ClientUser.findOneAndUpdate({ id }, payload, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Client user not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteClientUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ClientUser.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: 'Client user not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
