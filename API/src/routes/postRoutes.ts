import express, { NextFunction } from "express";
import multer from "multer";

const storageEngine = multer.memoryStorage();
const upload = multer({ storage: storageEngine });

import postValidator from "../validator/postValidator";
import Middleware from "../middleware";
import PostController from "../controller/postController";

const router = express.Router();

router.post(
  "/create",
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  upload.array("images"),
  PostController.create
);

router.get(
  "/read",
  postValidator.checkRead(),
  Middleware.handleValidationError,
  PostController.readPagination
);

router.get(
  "/read/:id",
  postValidator.checkIdParam(),
  Middleware.handleValidationError,
  PostController.readByUser
);

router.get(
  "/missions",
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  PostController.readMissions
);

router.get(
  "/:id",
  postValidator.checkIdParam(),
  Middleware.handleValidationError,
  PostController.readById
);

router.put(
  "/visib/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware(["admin"]),
  Middleware.handleValidationError,
  PostController.changeVisibility
);

router.delete(
  "/delete/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware(["utilisateur", "admin"]),
  Middleware.handleValidationError,
  PostController.delete
);

export default router;
