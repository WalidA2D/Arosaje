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
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  upload.single("image"),
  ImageController.uploadPP
);

router.get(
  "/pp/:id",
  postValidator.checkIdParam(),
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  ImageController.getPP
);

router.put(
  "/resetPP",
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
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
