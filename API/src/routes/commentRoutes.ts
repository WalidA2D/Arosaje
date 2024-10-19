import express from "express";
import commentValidator from "../validator/commentValidator";
import Middleware from "../middleware";
import commentController from "../controller/commentController";

const router = express.Router();

router.post(
  "/create",
  commentValidator.checkCreate(),
  Middleware.handleValidationError,
  Middleware.authMiddleware(["botaniste"]),
  commentController.create
);

router.get(
  "/read",
  commentValidator.checkRead(),
  Middleware.handleValidationError,
  commentController.readPagination
);

router.get(
  "/read/:id",
  commentValidator.checkReadByPost(),
  Middleware.handleValidationError,
  commentController.readByPost
);

router.delete(
  "/delete/:id",
  Middleware.authMiddleware(["botaniste", "administrateur"]), // Ajouter le contrôle d'accès
  commentValidator.checkReadByPost(),
  Middleware.handleValidationError,
  commentController.delete
);

export default router;
