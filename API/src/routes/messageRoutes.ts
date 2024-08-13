import express from "express";

import Middleware from "../middleware";
import postValidator from "../validator/postValidator";

import messageController from "../controller/messageController"

const router = express.Router();

router.post(
  "/add",
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
  messageController.add
);

router.get(
  "/read",
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
  // messageController.read
);

router.delete(
  "/delete/:id",
  postValidator.checkIdParam(),
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  Middleware.handleValidationError,
  messageController.delete
)

export default router;
