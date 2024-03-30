import mongoose, { Document, Model, Schema } from 'mongoose';
import { PetModelDb } from '../types/pet';
import { Image } from './image.entity';

interface PetModel extends Omit<PetModelDb, '_id'>, Document {}

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório']
    },
    age: {
        type: String,
        required: [true, 'Idade é obrigatória']
    },
    breed: {
        type: String,
        required: [true, 'Raça é obrigatória']
    },
    animal_size: {
        type: String,
        required: [true, 'Porte é obrigatório']
    },
    castrated: {
        type: Boolean,
        required: [true, 'Informe se o animal é castrado']
    },
    gender: {
        type: String,
        required: [true, 'Informe o sexo do animal']
    },
    vaccinated: {
        type: Boolean,
        required: [true, 'Informe se o animal é vacinado']
    },
    category: {
        type: String,
        required: [true, 'Informe a categoria do animal']
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User', required: true
    },
    images: {
        type: []
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

export const Pet: Model<PetModel> = mongoose.model<PetModel>('Pet', schema); 