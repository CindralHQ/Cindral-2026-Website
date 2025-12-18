import mongoose, { Schema, Document } from 'mongoose';
import { Project } from '../../../types';

export interface IProject extends Project, Document { }

const ProjectSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    divisionId: { type: String, required: true },
    title: { type: String, required: true },
    client: { type: String },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    images: [{ type: String }],
    year: { type: String, default: () => new Date().getFullYear().toString() }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
