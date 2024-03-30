import { ImageModelDb } from "@src/Domain/types/image";
import { PetModelDb } from "@src/Domain/types/pet";

export interface IPetRepository {
    getAll(page: number, limit: number, name?: string, category?: string, user_id?: string): Promise<PetModelDb[]>;
    getById(id: string): Promise<PetModelDb>;
    create(pet: PetModelDb): Promise<PetModelDb>;
    update(id: string, pet: PetModelDb, user_id: string): Promise<PetModelDb | null>;
    delete(id: string, user_id: string): Promise<boolean>;
} 