import mongoose, { Schema, Document } from 'mongoose';
import { TeamMember } from '../../../types';

export interface ITeamMember extends TeamMember, Document { }

const TeamMemberSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    linkedIn: { type: String },
    projectIds: [{ type: String }],
    csrActivities: [{ type: String }],
    skills: [{ type: String }],
    interests: [{ type: String }],
    quote: { type: String },
    learningStats: {
        currentStreak: { type: Number },
        totalHours: { type: Number },
        lastTopic: { type: String }
    },
    fitnessStats: {
        activityType: { type: String },
        weeklyMinutes: { type: Number },
        personalBest: { type: String }
    }
}, { timestamps: true });

export default mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
