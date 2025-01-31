import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserModelDb } from '../types/user';
import { AuthService } from '@src/Application/services/auth.service';

export enum CUSTOM_VALIDATION {
    DUPLICATED = 'DUPLICATED'
};

interface UserModel extends Omit<UserModelDb, '_id'>, Document {}

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório']
    },
    email: {
        type: String,
        required: [true, 'E-mail é obrigatório'],
        unique: [true, 'E-mail deve ser único.']
    },
    phone: {
        type: String,
        required: [true, 'Telefone é obrigatório.']
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        select: false
    },
    image: {
        type: String,
        required: false
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

schema.path('email').validate(
    async (email: string) => {
        const emailExists = await mongoose.models.User.countDocuments({ email });
        return !emailExists;
    },
    'email already exists in the database.',
    CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<UserModel>('save', async function (): Promise<void> {
    if(!this.password || !this.isModified('password')) {
        return;
    }

    try {
        this.password = await AuthService.hashPassword(this.password);
    } catch (error) {
        console.error(`Error hashing the password for the user ${this.name}`);
    }
});

export const User: Model<UserModel> = mongoose.model<UserModel>('User', schema);