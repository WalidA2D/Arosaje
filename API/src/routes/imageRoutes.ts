import express from "express";
import multer from "multer";

import Middleware from "../middleware";
import ImageController from "../controller/imageController";
import postValidator from "../validator/postValidator";

const storageEngine = multer.memoryStorage();
const upload = multer({ storage: storageEngine });

const router = express.Router();

router.post(
  "/pp/upload",
  upload.single("image"),
  Middleware.handleValidationError,
  ImageController.uploadPP
);

router.get(
  "/pp/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
  ImageController.getPP
);

router.put(
  "/resetPP/:id",
  postValidator.checkIdParam(),
  Middleware.handleValidationError,
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  ImageController.resetPP
);

// router.post(
//   '/upload/multiple',
//   upload.array('images'),
//   Middleware.handleValidationError,
//   ImageController.uploadMultipleImages
// );

// Delete an image
// router.delete(
//   '/:id',
//   Middleware.handleValidationError,
//   ImageController.deleteImage
// );

export default router;
