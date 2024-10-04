import express from "express";
import multer from "multer";

import Middleware from "../middleware";
import postValidator from "../validator/postValidator";
import messageController from "../controller/messageController";

const storageEngine = multer.memoryStorage();
const upload = multer({ storage: storageEngine });

const router = express.Router();

router.post(
  "/add",
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  upload.single("file"),
  messageController.add
);

router.get(
  "/read",
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  messageController.readByUser
);

router.get(
  "/messages/:id",
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  messageController.readByConv
);

router.delete(
  "/delete/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  messageController.delete
);

export default router;