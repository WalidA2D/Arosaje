import express from 'express';
import Middleware from '../middleware';
import ImageController from '../controller/imageController';

const router = express.Router();

// Upload images for posts
router.post(
  '/upload',
  Middleware.multerMiddleware.uploadMultiple,
  Middleware.handleValidationError,
  // Middleware.authMiddleware({ roles: ["utilisateur"] }),
  ImageController.uploadImage
);

// Get images of a post
router.get(
  '/post/:id',
  Middleware.handleValidationError,
  // ImageController.getImagesByPost
);

// Get a single image by its id
router.get(
  '/:id',
  Middleware.handleValidationError,
  // ImageController.getImageById
);

// Delete an image
router.delete(
  '/:id',
  Middleware.handleValidationError,
  Middleware.authMiddleware({ roles: ["admin"] }),
  // ImageController.deleteImage
);

export default router;
