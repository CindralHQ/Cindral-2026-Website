import { Request, Response } from 'express';
import Division from '../models/Division';
import Project from '../models/Project';
import TeamMember from '../models/TeamMember';
import ContactSubmission from '../models/ContactSubmission';
import ClientProject from '../models/ClientProject';
import ClientInvoice from '../models/ClientInvoice';
import ClientUser from '../models/ClientUser';
import Initiative from '../models/Initiative';
import { DIVISIONS, PROJECTS, TEAM, CLIENT_PORTAL_PROJECTS, CLIENT_INVOICES, INITIATIVES } from '../../../constants';

const seedData = () => ({
    divisions: JSON.parse(JSON.stringify(DIVISIONS)),
    projects: JSON.parse(JSON.stringify(PROJECTS)),
    team: JSON.parse(JSON.stringify(TEAM)),
    contactSubmissions: [],
    clientProjects: JSON.parse(JSON.stringify(CLIENT_PORTAL_PROJECTS)),
    clientInvoices: JSON.parse(JSON.stringify(CLIENT_INVOICES)),
    clientUsers: [],
    initiatives: JSON.parse(JSON.stringify(INITIATIVES))
});

export const exportData = async (_req: Request, res: Response) => {
    try {
        const data = {
            divisions: await Division.find(),
            projects: await Project.find(),
            team: await TeamMember.find(),
            contactSubmissions: await ContactSubmission.find(),
            clientProjects: await ClientProject.find(),
            clientInvoices: await ClientInvoice.find(),
            clientUsers: await ClientUser.find(),
            initiatives: await Initiative.find()
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const importData = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!Array.isArray(payload.divisions) || !Array.isArray(payload.projects) || !Array.isArray(payload.team)) {
            return res.status(400).json({ message: 'Invalid data payload' });
        }

        // Clear existing data
        await Promise.all([
            Division.deleteMany({}),
            Project.deleteMany({}),
            TeamMember.deleteMany({}),
            ContactSubmission.deleteMany({}),
            ClientProject.deleteMany({}),
            ClientInvoice.deleteMany({}),
            ClientUser.deleteMany({}),
            Initiative.deleteMany({})
        ]);

        // Insert new data
        await Promise.all([
            Division.insertMany(payload.divisions),
            Project.insertMany(payload.projects),
            TeamMember.insertMany(payload.team),
            ContactSubmission.insertMany(payload.contactSubmissions || []),
            ClientProject.insertMany(payload.clientProjects || []),
            ClientInvoice.insertMany(payload.clientInvoices || []),
            ClientUser.insertMany(payload.clientUsers || []),
            Initiative.insertMany(payload.initiatives || [])
        ]);

        res.json({ message: 'Data imported successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const resetData = async (_req: Request, res: Response) => {
    try {
        const data = seedData();

        await Promise.all([
            Division.deleteMany({}),
            Project.deleteMany({}),
            TeamMember.deleteMany({}),
            ContactSubmission.deleteMany({}),
            ClientProject.deleteMany({}),
            ClientInvoice.deleteMany({}),
            ClientUser.deleteMany({}),
            Initiative.deleteMany({})
        ]);

        await Promise.all([
            Division.insertMany(data.divisions),
            Project.insertMany(data.projects),
            TeamMember.insertMany(data.team),
            // contactSubmissions is empty
            ClientProject.insertMany(data.clientProjects),
            ClientInvoice.insertMany(data.clientInvoices),
            // clientUsers is empty
            Initiative.insertMany(data.initiatives)
        ]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
