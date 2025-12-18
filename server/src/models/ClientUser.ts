import mongoose, { Schema, Document } from 'mongoose';
import { ClientUser } from '../../../types';

export interface IClientUser extends ClientUser, Document { }

const ClientUserSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'viewer' },
    allowedProjectIds: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IClientUser>('ClientUser', ClientUserSchema);
