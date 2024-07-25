import express from 'express';
import UserValidator from '../validator/userValidator';
import Middleware from '../middleware';
import UserController from '../controller/userController';

const router = express.Router();

router.post(
	'/create',
	UserValidator.checkCreate(),
	Middleware.handleValidationError,
	UserController.create
);

router.get(
	'/read',
	UserValidator.checkRead(),
	Middleware.handleValidationError,
	UserController.readPagination
);

router.get(
	'/read/:id',
	UserValidator.checkIdParam(),
	Middleware.handleValidationError,
	UserController.readByID
);

router.put(
	'/update/:id',
	UserValidator.checkIdParam(),
	Middleware.handleValidationError,
	UserController.update
);

router.delete(
	'/delete/:id',
	UserValidator.checkIdParam(),
	Middleware.authMiddleware({roles : ["admin"]}),
	Middleware.handleValidationError,
	UserController.delete
);

router.post(
    '/login',
    UserValidator.checkLogin(),
    Middleware.handleValidationError,
    UserController.connexion
);

export default router;