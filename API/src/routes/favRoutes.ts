import express from "express";

import Middleware from "../middleware";
import postValidator from "../validator/postValidator";

import favController from "../controller/favController"

const router = express.Router();

router.post(
  "/add/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
);

router.get(
  "/read/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
);

router.delete(
  "/delete/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
)

export default router;
