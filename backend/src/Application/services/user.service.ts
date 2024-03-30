import { IUserRepository } from "@src/Domain/interfaces/repositories/user.repository.interface";
import { UserModelDb, UserResponse } from "@src/Domain/types/user";
import { UserRepository } from "@src/Infra/data/repositories/user.repository";

class UserService {
    private userRepository: IUserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async getById(id: string): Promise<UserResponse> {
        const userResponse = await this.userRepository.getById(id);
        return {
            id: userResponse.id,
            name: userResponse.name,
            email: userResponse.email,
            phone: userResponse.phone,
            image: userResponse.image
        }
    }

    public async getByEmail(email: string): Promise<Partial<UserResponse> | null> {
        const userResponse = await this.userRepository.getByEmail(email);
        return {
            id: userResponse?.id,
            name: userResponse?.name,
            email: userResponse?.email,
            phone: userResponse?.phone,
            image: userResponse?.image,
            password: userResponse?.password
        }
    }

    public async create(user: UserModelDb): Promise<UserResponse> {
        const userResponse = await this.userRepository.create(user);
        return {
            id: userResponse.id,
            name: userResponse.name,
            email: userResponse.email,
            phone: userResponse.phone,
            image: userResponse.image
        }
    }

    public async update(id: string, user: UserModelDb): Promise<UserResponse> {
        await this.userRepository.update(id, user);
        const userResponse = await this.userRepository.getById(id);
        return {
            id: userResponse.id,
            name: userResponse.name,
            email: userResponse.email,
            phone: userResponse.phone,
            image: userResponse.image
        }
    }

    public async delete(id: string): Promise<any> {
        const deleted = await this.userRepository.delete(id);

        if(deleted) {
            return {
                deleted: true,
                message: 'User successfully deleted'
            };
        } else {
            return {
                deleted: false,
                message: 'User not deleted'
            };
        }
    }
}

export default new UserService();