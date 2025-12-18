import { Request, Response } from 'express';
import Division, { IDivision } from '../models/Division';
import { DivisionType } from '../../../types';

export const getDivisions = async (_req: Request, res: Response) => {
    try {
        const divisions = await Division.find();
        res.json(divisions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createDivision = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload.title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const newDivision = new Division({
            id: payload.id || `div_${Date.now()}`,
            type: payload.type || DivisionType.LABS,
            title: payload.title,
            tagline: payload.tagline,
            description: payload.description,
            iconName: payload.iconName,
            color: payload.color,
            themeColor: payload.themeColor,
            bannerImage: payload.bannerImage
        });

        const savedDivision = await newDivision.save();
        res.status(201).json(savedDivision);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateDivision = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const division = await Division.findOneAndUpdate({ id }, payload, { new: true });
        if (!division) {
            return res.status(404).json({ message: 'Division not found' });
        }
        res.json(division);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteDivision = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await Division.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: 'Division not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
