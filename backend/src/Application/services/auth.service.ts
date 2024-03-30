import { UserResponse } from '@src/Domain/types/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from './user.service';

export interface payloadToken {
    userId: string;
}

interface UserModel extends UserResponse {}

class AuthService {
    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public static async comparePassword(passwordText: string, passwordHashed: string): Promise<boolean> {
        return await bcrypt.compare(passwordText, passwordHashed);
    }

    public static generateAuthToken(payload: payloadToken): string {
        const key: string = process.env.key as string;
        const expiresIn: number = (Date.now() + 3600);

        const token = jwt.sign(payload, key, { expiresIn: expiresIn });
        return token;
    }

    public static decodeToken(token: string): payloadToken {
        const key: string = process.env.key as string;
        return jwt.verify(token, key) as payloadToken;
    }
    
    public static async getUserByEmail(email: string): Promise<Partial<UserModel> | null> {
        return await userService.getByEmail(email);
    }
}

export { AuthService };