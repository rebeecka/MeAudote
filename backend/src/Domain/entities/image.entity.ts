import mongoose, { Document, Model, Schema } from 'mongoose';
import { ImageModelDb } from '../types/image';

interface ImageModel extends Omit<ImageModelDb, '_id'>, Document {}

const schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform: (_, ret): void => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const Image: Model<ImageModel> = mongoose.model<ImageModel>('Image', schema);