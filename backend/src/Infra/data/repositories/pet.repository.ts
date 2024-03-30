import { Pet } from "@src/Domain/entities/pet.entity";
import { IPetRepository } from "@src/Domain/interfaces/repositories/pet.repository.interface";
import { PetModelDb } from "@src/Domain/types/pet";

class PetRepository implements IPetRepository {
    public async getAll(page: number = 1, limit: number = 20, name?: string, category?: string, user_id?: string): Promise<PetModelDb[]> {
        const skip: number = limit * (page - 1);
        const query = Pet.find().populate('user');
        if(category) {
            query.where('category', category);
        }
        if(user_id) {
            query.where('user', user_id);
        }
        if(name) {
            query.where('name', { $regex: '.*' + name + '.*', $options: 'i' });
        }
        return await query.skip(skip).limit(limit);
    }

    public async getById(id: string): Promise<PetModelDb> {
        const pet = await Pet.findById(id).populate('user');
        
        if(!pet) {
            throw {
                status: 404,
                message: 'User not found'
            };
        }
        
        return pet;
    }

    public async create(data: PetModelDb): Promise<PetModelDb> {
        const pet = (await Pet.create(data)).populate('user');
        return pet;
    }

    public async update(id: string, data: PetModelDb, user_id: string): Promise<PetModelDb | null> {
        const pet = await Pet.findById(id);
        
        if(!pet) {
            throw {
                status: 404,
                message: 'Pet não encontrado'
            };
        }

        if(pet.user != user_id) {
            throw {
                status: 403,
                message: 'Permissão negada - usuário não tem permissão para editar as informações'
            };
        }

        await Pet.updateOne({ _id: id }, data);

        return await Pet.findById(id).populate('user');
    }

    public async delete(id: string, user_id: string): Promise<boolean> {
        const pet = await Pet.findById(id);
        
        if(!pet) {
            throw {
                status: 404,
                message: 'Pet não encontrado'
            };
        }

        if(pet.user != user_id) {
            throw {
                status: 403,
                message: 'Permissão negada - usuário não tem permissão para deletar'
            };
        }
        
        await Pet.deleteOne({ _id: id });

        return true;
    }
}

export { PetRepository };