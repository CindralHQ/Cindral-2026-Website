import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import Initiative from '../models/Initiative';

export const getInitiatives = async (_req: Request, res: Response) => {
    try {
        const initiatives = await Initiative.find();
        res.json(initiatives);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createInitiative = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload.title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const newInitiative = new Initiative({
            id: payload.id || `init_${nanoid(8)}`,
            title: payload.title,
            image: payload.image,
            description: payload.description,
            fullContent: payload.fullContent,
            iconName: payload.iconName,
            color: payload.color,
            bgHover: payload.bgHover,
            textHover: payload.textHover,
            stats: payload.stats
        });

        const savedInitiative = await newInitiative.save();
        res.status(201).json(savedInitiative);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateInitiative = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const initiative = await Initiative.findOneAndUpdate({ id }, payload, { new: true });
        if (!initiative) {
            return res.status(404).json({ message: 'Initiative not found' });
        }
        res.json(initiative);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteInitiative = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await Initiative.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: 'Initiative not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
