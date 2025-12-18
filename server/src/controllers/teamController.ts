import { Request, Response } from 'express';
import TeamMember from '../models/TeamMember';

export const getTeam = async (_req: Request, res: Response) => {
    try {
        const team = await TeamMember.find();
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createTeamMember = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload.name || !payload.role) {
            return res.status(400).json({ message: 'Name and role are required' });
        }

        const newMember = new TeamMember({
            id: payload.id || `team_${Date.now()}`,
            name: payload.name,
            role: payload.role,
            bio: payload.bio,
            image: payload.image,
            linkedIn: payload.linkedIn,
            projectIds: payload.projectIds,
            csrActivities: payload.csrActivities,
            skills: payload.skills,
            interests: payload.interests,
            quote: payload.quote,
            learningStats: payload.learningStats,
            fitnessStats: payload.fitnessStats
        });

        const savedMember = await newMember.save();
        res.status(201).json(savedMember);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const member = await TeamMember.findOneAndUpdate({ id }, payload, { new: true });
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await TeamMember.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
