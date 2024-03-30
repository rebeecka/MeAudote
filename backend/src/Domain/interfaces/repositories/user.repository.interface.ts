import { UserModelDb, UserResponse } from "@src/Domain/types/user";

export interface IUserRepository {
    getAll(page: number, limit: number): Promise<UserModelDb[]>;
    getById(id: string): Promise<UserResponse>;
    getByEmail(email: string): Promise<UserResponse | null>;
    create(user: UserModelDb): Promise<UserResponse>;
    update(id: string, user: UserModelDb): Promise<UserResponse>;
    delete(id: string): Promise<boolean>;
}