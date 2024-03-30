import { IPetRepository } from "@src/Domain/interfaces/repositories/pet.repository.interface";
import { IPetService } from "@src/Domain/interfaces/services/pet.service.interface";
import { PetModelDb } from "@src/Domain/types/pet";
import { PetRepository } from "@src/Infra/data/repositories/pet.repository";

class PetService implements IPetService{
    private petRepository: IPetRepository;

    constructor() {
        this.petRepository = new PetRepository();
    }

    public async getAll(page: number, limit: number, name?: string, category?: string, user_id?: string): Promise<PetModelDb[]> {
        return await this.petRepository.getAll(page, limit, name, category, user_id);
    }

    public async getById(id: string): Promise<PetModelDb> {
        return await this.petRepository.getById(id);
    }

    public async create(pet: PetModelDb): Promise<PetModelDb> {
        return await this.petRepository.create(pet);
    }

    public async update(id: string, pet: PetModelDb, user_id: string): Promise<PetModelDb | null> {
        return await this.petRepository.update(id, pet, user_id);
    }

    public async delete(id: string, user_id: string): Promise<boolean> {
        return await this.petRepository.delete(id, user_id);
    }
}

export default new PetService();