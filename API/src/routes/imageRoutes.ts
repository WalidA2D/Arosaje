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
  Middleware.authMiddleware(["utilisateur"]),
  upload.single("image"),
  Middleware.handleValidationError,
  ImageController.uploadPP
);

router.get(
  "/pp/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  ImageController.getPP
);

router.put(
  "/resetPP",
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  ImageController.resetPP
);

// Uncomment if needed
// router.post(
//   '/upload/multiple',
//   upload.array('images'),
//   Middleware.handleValidationError,
//   ImageController.uploadMultipleImages
// );

// Uncomment if needed
// router.delete(
//   '/:id',
//   Middleware.handleValidationError,
//   ImageController.deleteImage
// );

export default router;
