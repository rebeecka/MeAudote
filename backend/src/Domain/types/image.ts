import mongoose from "mongoose";

export type ImageModelDb = {
    _id?: mongoose.Types.ObjectId;
    name: string;
}