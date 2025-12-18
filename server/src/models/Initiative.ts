import mongoose, { Schema, Document } from 'mongoose';
import { Initiative, InitiativeStat, Milestone } from '../../../types';

export interface IInitiative extends Initiative, Document { }

const InitiativeStatSchema = new Schema({
    label: String,
    value: Number
});

const MilestoneSchema = new Schema({
    date: String,
    title: String,
    description: String,
    status: { type: String, enum: ['completed', 'ongoing', 'upcoming'] }
});

const InitiativeSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    fullContent: { type: String, default: '' },
    iconName: { type: String, default: 'Heart' },
    color: { type: String, default: 'text-white' },
    bgHover: { type: String, default: '' },
    textHover: { type: String, default: '' },
    stats: [InitiativeStatSchema],
    gallery: [{ type: String }],
    milestones: [MilestoneSchema]
}, { timestamps: true });

export default mongoose.model<IInitiative>('Initiative', InitiativeSchema);
