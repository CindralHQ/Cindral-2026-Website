import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import ContactSubmission from '../models/ContactSubmission';

export const createContactSubmission = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload.firstName || !payload.email || !payload.message) {
            return res.status(400).json({ message: 'First name, email, and message are required' });
        }

        const submission = new ContactSubmission({
            id: `submission_${nanoid(10)}`,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
            status: 'new'
        });

        const savedSubmission = await submission.save();
        res.status(201).json(savedSubmission);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getContactSubmissions = async (_req: Request, res: Response) => {
    try {
        // Newest first
        const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateContactSubmission = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const submission = await ContactSubmission.findOneAndUpdate({ id }, payload, { new: true });
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteContactSubmission = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ContactSubmission.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
