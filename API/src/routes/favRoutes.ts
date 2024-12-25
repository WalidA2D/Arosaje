import express from "express";

import Middleware from "../middleware";
import postValidator from "../validator/postValidator";
import favController from "../controller/favController";

const router = express.Router();

router.post(
  "/add",
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  favController.add
);

router.get(
  "/read",
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  favController.read
);

router.delete(
  "/delete/:id",
  postValidator.checkIdParam(),
  Middleware.handleValidationError,
  Middleware.authMiddleware(["utilisateur"]),
  favController.delete
);

router.get(
  "/test",
  favController.test
);

export default router;
