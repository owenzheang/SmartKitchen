import express from "express";
import {
  deleteSavedRecipe,
  getSavedRecipeById,
  getSavedRecipes,
  saveRecipe
} from "../controllers/savedRecipeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", saveRecipe);
router.get("/", getSavedRecipes);
router.get("/:id", getSavedRecipeById);
router.delete("/:id", deleteSavedRecipe);

export default router;
