import mongoose, { Schema, Document } from 'mongoose';
import { ClientInvoice } from '../../../types';

export interface IClientInvoice extends ClientInvoice, Document { }

const ClientInvoiceSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['paid', 'due', 'overdue'], default: 'due' },
    issuedOn: { type: String, required: true },
    dueOn: { type: String, required: true },
    description: { type: String, default: '' },
    downloadUrl: { type: String }
}, { timestamps: true });

export default mongoose.model<IClientInvoice>('ClientInvoice', ClientInvoiceSchema);
