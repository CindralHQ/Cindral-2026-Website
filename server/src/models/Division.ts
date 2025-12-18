import mongoose, { Schema, Document } from 'mongoose';
import { Division, DivisionType } from '../../../types';

export interface IDivision extends Division, Document { }

const DivisionSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(DivisionType), required: true },
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    iconName: { type: String, default: 'FlaskConical' },
    color: { type: String, default: 'text-white' },
    themeColor: { type: String, default: '#ffffff' },
    bannerImage: { type: String }
}, { timestamps: true });

export default mongoose.model<IDivision>('Division', DivisionSchema);
