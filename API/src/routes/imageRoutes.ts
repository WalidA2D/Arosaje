import express from 'express';
import Middleware from '../middleware';
import ImageController from '../controller/imageController';

const router = express.Router();

router.post(
  '/upload',
  Middleware.handleValidationError,
//   Middleware.authMiddleware({ roles: ["utilisateur"] }),
  ImageController.uploadImage
);

router.get(
  '/post/:postId',
  Middleware.handleValidationError,
  ImageController.getImagesByPost
);

router.get(
  '/:id',
  Middleware.handleValidationError,
  ImageController.getImageById
);

router.delete(
  '/:id',
  Middleware.handleValidationError,
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  ImageController.deleteImage
);

export default router;
