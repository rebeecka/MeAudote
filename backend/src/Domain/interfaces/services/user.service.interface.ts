import { UserModelDb } from "@src/Domain/types/user";

export interface IUserService {
    getById(id: string): Promise<UserModelDb>;
    create(user: UserModelDb): Promise<UserModelDb>;
    update(id: string, user: UserModelDb): Promise<UserModelDb>;
    delete(id: string): Promise<boolean>;
}