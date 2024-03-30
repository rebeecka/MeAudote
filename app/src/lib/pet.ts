export interface Pet {
    name: string,
    age: string,
    breed: string,
    animal_size: string,
    castrated: boolean,
    gender: string,
    vaccinated: boolean,
    category: string,
    user_id: string,
    id: string,
    images: ImageList,
    user?: User
}

export type PetList = Pet[];
export type ImageList = ImageData[];
export interface ImageData {
    name: string,
    url?: string,
    base64?: string
}
interface User {
    id: string,
    phone?: string,
    name?: string
}

export class RegistroPet {
    constructor(
        public name: string,
        public age: string,
        public breed: string,
        public animal_size: string,
        public castrated: boolean,
        public gender: string,
        public vaccinated: boolean,
        public category: string,
        public images: any[],
        public newImages?: any[] 
    ) {}
}
