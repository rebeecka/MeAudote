import { IUserRepository } from '@src/Domain/interfaces/repositories/user.repository.interface';
import { UserModelDb, UserResponse } from '@src/Domain/types/user';
import { User } from '@src/Domain/entities/user.entity';
import { AuthService } from '@src/Application/services/auth.service';

class UserRepository implements IUserRepository {
    public async getAll(page: number = 1, limit: number = 10): Promise<UserModelDb[]> {
        const skip: number = limit * (page - 1);
        const users = await User.find().skip(skip).limit(limit);
        return users;
    }

    public async getById(id: string): Promise<UserResponse> {
        const user = await User.findById(id);
        if(!user) {
            throw {
                status: 404,
                message: 'Usuário não encontrado'
            };
        }

        return user as UserResponse;
    }

    public async getByEmail(email: string): Promise<UserResponse | null> {
        const user = await User.findOne({ email: email }).select('+password');
        
        return user;
    }

    public async create(data: UserModelDb): Promise<UserResponse> {
        const userEmailExists = await this.getByEmail(data.email);
        
        if(userEmailExists) {
            throw {
                status: 400,
                message: 'Já existe uma conta com este email'
            };
        }

        const userPhoneExists = await User.findOne({ phone: data.phone });

        if(userPhoneExists) {
            throw {
                status: 400,
                message: 'Já existe uma conta com este telefone'
            };
        }

        const user = await User.create(data);
        return user as UserResponse;
    }

    public async update(id: string, data: UserModelDb): Promise<UserResponse> {
        const user = await User.findById(id);
        if(!user) {
            throw {
                status: 404,
                message: 'Usuário não encontrado'
            };
        }

        const userEmailExists = await this.getByEmail(data.email);
        if(userEmailExists && userEmailExists.id != user.id) {
            throw {
                status: 400,
                message: 'Já existe uma conta com este e-mail'
            };
        }

        const userPhoneExists = await User.findOne({ phone: data.phone });

        if(userPhoneExists && userPhoneExists.id != user.id) {
            throw {
                status: 400,
                message: 'Já existe uma conta com este telefone'
            };
        }

        if(!data.image)
            data.image = user.image

        if(!data.password) 
            delete data.password;
        else 
            data.password = await AuthService.hashPassword(data.password);

        await User.updateOne({ _id: user.id }, data);
        return user as UserResponse;
    }

    public async delete(id: string): Promise<boolean> {
        const user = await User.findById(id);
        if(!user) {
            throw {
                status: 404,
                message: 'Usuário não encontrado'
            };
        }

        await User.deleteOne({ _id: id });

        return true;
    }
}

export { UserRepository };