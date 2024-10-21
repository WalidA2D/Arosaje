import express from "express";
import UserValidator from "../validator/userValidator";
import Middleware from "../middleware";
import UserController from "../controller/userController";

const router = express.Router();

router.post(
  "/create",
  UserValidator.checkCreate(),
  Middleware.handleValidationError,
  UserController.create
);

router.get(
  "/profil",
  Middleware.authMiddleware(),
  Middleware.handleValidationError,
  UserController.readOwnProfile
);


router.get(
  "/read",
  UserValidator.checkRead(),
  Middleware.handleValidationError,
  Middleware.authMiddleware(['administrateur']),
  UserController.readPagination
);


router.get(
  "/read/:id",
  UserValidator.checkIdParam(),
  Middleware.handleValidationError,
  UserController.readByID
);

router.put(
  "/update",
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  UserController.update
);

router.delete(
  "/delete/:id",
  UserValidator.checkIdParam(),
  Middleware.handleValidationError,
  Middleware.authMiddleware(["administrateur"]),
  UserController.delete
);

router.post(
  "/login",
  UserValidator.checkLogin(),
  Middleware.handleValidationError,
  UserController.connexion
);

export default router;
