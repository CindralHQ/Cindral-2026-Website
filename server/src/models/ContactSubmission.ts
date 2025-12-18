import mongoose, { Schema, Document } from 'mongoose';
import { ContactSubmission, ContactSubmissionStatus } from '../../../types';

export interface IContactSubmission extends ContactSubmission, Document { }

const ContactSubmissionSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, required: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    status: { type: String, enum: ['new', 'in_progress', 'responded'], default: 'new' }
}, { timestamps: true });

export default mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
