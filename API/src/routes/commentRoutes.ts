import express from 'express';
import commentValidator from '../validator/commentValidator';
import Middleware from '../middleware';
import CommentController from '../controller/commentController'
import commentController from '../controller/commentController';

const router = express.Router();

router.post(
    '/create',
    commentValidator.checkCreate(),
    Middleware.handleValidationError,
    Middleware.authMiddleware({roles : ["botaniste"]}),
    CommentController.create
)

router.get(
	'/read',
	commentValidator.checkRead(),
	Middleware.handleValidationError,
	commentController.readPagination
);

router.delete(
	'/delete/:id',
	commentValidator.checkReadByUser(),
	Middleware.handleValidationError,
	commentController.delete
);


export default router;