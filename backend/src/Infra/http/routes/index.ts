import { UserController } from "@src/Api/controllers/user.controller";
import { PetController } from "@src/Api/controllers/pet.controller";
import { Router } from "express";

import { AuthController } from "@src/Api/controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const userController = new UserController();
const authController = new AuthController();
const petController = new PetController();

const router = Router();

router.get('/users/me', authMiddleware, userController.show);
router.post('/users', userController.store);
router.put('/users/me', authMiddleware, userController.update);
router.delete('/users/me', authMiddleware, userController.destroy);

router.post('/auth/login', authController.login);

router.get('/pets-open', petController.index);
router.get('/pets', authMiddleware, petController.index);
router.get('/pets/:id', authMiddleware, petController.show);
router.post('/pets', authMiddleware, petController.create);
router.put('/pets/:id', authMiddleware, petController.update);
router.delete('/pets/:id', authMiddleware, petController.destroy);

export default router;