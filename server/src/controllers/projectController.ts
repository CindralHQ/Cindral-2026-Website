import { Request, Response } from 'express';
import Project from '../models/Project';

export const getProjects = async (_req: Request, res: Response) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload.title || !payload.divisionId) {
            return res.status(400).json({ message: 'Title and divisionId are required' });
        }

        const newProject = new Project({
            id: payload.id || `proj_${Date.now()}`,
            divisionId: payload.divisionId,
            title: payload.title,
            client: payload.client,
            summary: payload.summary,
            content: payload.content,
            images: payload.images,
            year: payload.year
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const project = await Project.findOneAndUpdate({ id }, payload, { new: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await Project.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
