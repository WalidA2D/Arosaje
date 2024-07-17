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

export default router;