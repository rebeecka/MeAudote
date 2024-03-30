import { AuthService } from '@src/Application/services/auth.service';
import { NextFunction, Request, Response } from 'express';


export function authMiddleware(request: Partial<Request>, response: Partial<Response>, next: NextFunction) {
    const token = request.headers?.authorization?.split(' ')[1];
    try {
        const decoded = AuthService.decodeToken(token as string);
        request.decoded = decoded;
        next(); 
    } catch (error) {
        response.status?.(401).send({ code: 401, error: error.message });
    }
}