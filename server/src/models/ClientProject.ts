import mongoose, { Schema, Document } from 'mongoose';
import { ClientProject, ClientProjectTask, ClientProjectTimelineItem, ClientUpdate, ClientResourceLink } from '../../../types';

export interface IClientProject extends ClientProject, Document { }

const ClientResourceLinkSchema = new Schema({
    id: String,
    label: String,
    url: String,
    type: { type: String, enum: ['doc', 'design', 'repo', 'prototype', 'analytics', 'ticket', 'storage'] },
    description: String
});

const ClientProjectTaskSchema = new Schema({
    id: String,
    title: String,
    status: { type: String, enum: ['todo', 'in_progress', 'done', 'cancelled'] },
    owner: String,
    dueDate: String,
    highlight: String,
    notes: String
});

const ClientProjectTimelineItemSchema = new Schema({
    id: String,
    label: String,
    date: String,
    status: { type: String, enum: ['complete', 'active', 'upcoming'] },
    description: String
});

const ClientUpdateSchema = new Schema({
    id: String,
    title: String,
    date: String,
    author: String,
    summary: String,
    type: { type: String, enum: ['win', 'risk', 'note', 'decision'] },
    impact: String
});

const ClientProjectSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    clientName: { type: String, required: true },
    name: { type: String, required: true },
    summary: { type: String, default: '' },
    status: { type: String, enum: ['On Track', 'At Risk', 'Behind'], default: 'On Track' },
    health: { type: String, enum: ['green', 'amber', 'red'], default: 'green' },
    progress: { type: Number, default: 0 },
    budgetUsed: { type: Number, default: 0 },
    startDate: { type: String, default: () => new Date().toISOString() },
    endDate: { type: String, default: () => new Date().toISOString() },
    nextMilestone: { type: String, default: '' },
    team: [{ type: String }],
    resources: [ClientResourceLinkSchema],
    tasks: [ClientProjectTaskSchema],
    timeline: [ClientProjectTimelineItemSchema],
    updates: [ClientUpdateSchema],
    links: [ClientResourceLinkSchema]
}, { timestamps: true });

export default mongoose.model<IClientProject>('ClientProject', ClientProjectSchema);
