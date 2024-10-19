import express from "express";

import Middleware from "../middleware";
import postValidator from "../validator/postValidator";
import favController from "../controller/favController";

const router = express.Router();

router.post(
  "/add",
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  favController.add
);

router.get(
  "/read",
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  favController.read
);

router.delete(
  "/delete/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware(["utilisateur"]),
  Middleware.handleValidationError,
  favController.delete
);

export default router;
