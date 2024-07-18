import express from 'express';
import postValidator from '../validator/postValidator';
import Middleware from '../middleware';
import PostController from '../controller/postController';

const router = express.Router();

router.post(
	'/create',
	postValidator.checkCreate(),
	Middleware.handleValidationError,
    Middleware.authMiddleware({roles : ["utilisateur"]}),
	PostController.create
);

router.get(
	'/read',
	postValidator.checkRead(),
	Middleware.handleValidationError,
	PostController.readPagination
);

router.get(
	'/read/:id',
	postValidator.checkReadByUser(),
	Middleware.handleValidationError,
	PostController.readByUser
);

router.delete(
	'/delete/:id',
	postValidator.checkReadByUser(),
	Middleware.handleValidationError,
	PostController.delete
);

export default router;