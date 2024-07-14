import express from 'express';
import UserValidator from '../validator/userValidator';
import Middleware from '../middleware';
import userController from '../controller/userController';

const router = express.Router();

router.post(
	'/create',
	UserValidator.checkCreate(),
	Middleware.handleValidationError,
	userController.create
);

router.get(
	'/read',
	UserValidator.checkRead(),
	Middleware.handleValidationError,
	userController.readPagination
);

router.get(
	'/read/:id',
	UserValidator.checkIdParam(),
	Middleware.handleValidationError,
	userController.readByID
);

// router.put(
// 	'/update/:id',
// 	UserValidator.checkIdParam(),
// 	Middleware.handleValidationError,
// 	userController.update
// );

router.delete(
	'/delete/:id',
	UserValidator.checkIdParam(),
	Middleware.handleValidationError,
	userController.delete
);

export default router;