import express from "express";
import multer from "multer";

import Middleware from "../middleware";
import messageController from "../controller/messageController";

const storageEngine = multer.memoryStorage();
const upload = multer({ storage: storageEngine });

const router = express.Router();

router.post(
  "/add",
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  upload.single("file"),
  messageController.add
);

router.get(
  "/read",
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  messageController.readByUser
);

router.get(
  "/messages/:id",
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  messageController.readByConv
);

router.delete(
  "/delete/:id",
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  messageController.delete
);

export default router;
