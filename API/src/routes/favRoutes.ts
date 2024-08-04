import express from "express";

import Middleware from "../middleware";
import postValidator from "../validator/postValidator";

import favController from "../controller/favController"

const router = express.Router();

router.post(
  "/add",
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
  favController.add
);

router.get(
  "/read",
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
  favController.read
);

router.delete(
  "/delete/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
)

export default router;
