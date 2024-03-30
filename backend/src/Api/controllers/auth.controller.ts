import { AuthService } from "@src/Application/services/auth.service";
import { Request, Response } from "express";

class AuthController {
    async login(request: Request, response: Response): Promise<Response> {
        try {
            const { email, password } = request.body;
            
            const user = await AuthService.getUserByEmail(email);
            if(!user || !user.id) {
                return response.status(401).send({
                    message: 'E-mail e/ou senha inválidos'
                });
            }
            
            const passwordValid = await AuthService.comparePassword(password, user.password || '');
            
            if(!passwordValid) {
                return response.status(401).send({
                    message: 'E-mail e/ou senha inválidos'
                });
            }

            const token = await AuthService.generateAuthToken({ userId: user.id });
            
            return response.send({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                access_token: token
            });
        } catch (error) {
            return response.status(400).send({
                message: error.message || 'Internal server error'
            });
        }
    }
}

export { AuthController };