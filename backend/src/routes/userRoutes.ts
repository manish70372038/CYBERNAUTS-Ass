import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  linkUsers,
  unlinkUsers,
} from "../controllers/userController";
import {
  getRecommendations,
  submitFeedback,
} from "../controllers/recommendationController";
import { validateUser, handleValidationErrors } from "../middleware/validate";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", validateUser, handleValidationErrors, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/link", linkUsers);
router.delete("/:id/unlink", unlinkUsers);
router.get("/:id/recommendations", getRecommendations);
router.post("/:id/recommendations/feedback", submitFeedback);

export default router;