import { Base64ToImageService } from "@src/Application/services/Base64ToImageService";
import petService from "@src/Application/services/pet.service";
import { ImageModelDb } from "@src/Domain/types/image";
import { File } from "buffer";
import { Request, Response } from "express";
import mongoose from "mongoose";

class PetController {

    async index(request: Request, response: Response): Promise<Response> {
        try {
            const { page, limit, name, category = null, me = null } = request.query;
            let user_id = undefined;
            
            if(String(me) === 'true') {
                user_id = request.decoded?.userId;
            }
            const pets = await petService.getAll(Number(page || 1), Number(limit || 20), String(name || ''), String(category || ''), user_id);

            return response.send(pets);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;

            const pet = await petService.getById(id);

            return response.send(pet);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            let { name, age, breed, animal_size, castrated, gender, vaccinated, category, images = [] } = request.body;
            
            images = typeof(images) === 'string' ? JSON.parse(images) : images;

            const user_id = request.decoded?.userId || '';
            let imagesNames: ImageModelDb[] = [];
        
            if(images && Array.isArray(images) && images.length) {
                imagesNames = images.map((image): ImageModelDb => {
                    const imageName = Base64ToImageService.base64ToImage(image);
                    return {
                        _id: new mongoose.Types.ObjectId()._id,
                        name: imageName
                    };
                });
            }

            const pet = await petService.create({ name, age, breed, animal_size, castrated, gender, vaccinated, category, user: user_id, images: imagesNames });

            return response.send(pet);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            let { name, age, breed, animal_size, castrated, gender, vaccinated, category, images = [], newImages = [] } = request.body;
            
            images = typeof(images) === 'string' ? JSON.parse(images) : images;
            newImages = typeof(newImages) === 'string' ? JSON.parse(newImages) : newImages;
            let imagesNames: ImageModelDb[] = [];

            const user_id = request.decoded?.userId || '';
            
            if(newImages && Array.isArray(newImages) && newImages.length) {
                imagesNames = newImages.map((image): ImageModelDb => {
                    const imageName = Base64ToImageService.base64ToImage(image);
                    return {
                        _id: new mongoose.Types.ObjectId()._id,
                        name: imageName
                    };
                });
            }

            if(images && Array.isArray(images) && images.length) {
                images.forEach(img => {
                    imagesNames.push({
                        _id: new mongoose.Types.ObjectId()._id,
                        name: img
                    });
                });
            }

            const pet = await petService.update(id, { name, age, breed, animal_size, castrated, gender, vaccinated, category, user: user_id, images: imagesNames }, user_id);

            return response.send(pet);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }

    async destroy(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const user_id = request.decoded?.userId || '';

            const deleted = await petService.delete(id, user_id);

            return response.send(deleted);
        } catch (error) {
            return response.status(error.status || 500).send({
                message: error.message || 'Internal server error'
            });
        }
    }
}

export { PetController };