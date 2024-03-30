import { ImageModelDb } from "./image";

export type PetModelDb = {
    _id?: string;
    name: string;
    age: string;
    breed: string;
    animal_size: string;
    castrated: boolean;
    gender: string;
    vaccinated: boolean;
    category: string;
    user: string;
    images: ImageModelDb[];
};