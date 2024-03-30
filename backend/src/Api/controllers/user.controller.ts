import { Base64ToImageService } from "@src/Application/services/Base64ToImageService";
import userService from "@src/Application/services/user.service";
import { Request, Response } from "express";

class UserController {

    public async show(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.decoded?.userId as string;
            const user = await userService.getById(id);
            return response.send(user);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }

    public async store(request: Request, response: Response): Promise<Response> {
        try {
            const { name, phone, email, password, image } = request.body;
            
            let imageName = image ? await Base64ToImageService.base64ToImage(image) : undefined;

            const user = await userService.create({ name, phone, email, password, image: imageName });
            return response.status(201).send(user);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }

    public async update(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.decoded?.userId as string;
            const { name, phone, email, password, image } = request.body;
            let user;
            
            let imageName = image ? Base64ToImageService.base64ToImage(image) : undefined;
            user = await userService.update(id, { name, phone, email, password, image: imageName });
            return response.send(user);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }

    public async destroy(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.decoded?.userId as string;
            const deleted = await userService.delete(id);
            return response.send(deleted);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }
}

export { UserController };