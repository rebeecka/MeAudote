import mongoose, {Mongoose} from "mongoose";

const DATABASE_URL: string = process.env.DATABASE_URL || '';

export const connect = async (): Promise<Mongoose> =>
    await mongoose.connect(DATABASE_URL);

export const close = (): Promise<void> => mongoose.connection.close();