import express from "express";
import {
  addIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient
} from "../controllers/ingredientController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getIngredients);
router.post("/", addIngredient);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);

export default router;
