import database from "../database.js";
import {
  dangerousIngredientNames,
  generateRecipesWithDeepSeek
} from "../services/deepseekService.js";
import { fetchRecipeImageUrl } from "../services/pexelsService.js";

const allowedCuisines = ["Chinese", "Japanese", "Western", "Korean", "Indian", "Thai"];
const allowedDifficulties = ["Easy", "Medium", "Hard"];
const imageProvider = (process.env.IMAGE_PROVIDER || "placeholder").trim().toLowerCase();

function getUserIngredients(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, name, quantity, unit
      FROM ingredients
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    database.all(sql, [userId], (error, ingredients) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(ingredients);
    });
  });
}

export async function generateRecipes(req, res) {
  try {
    const { cuisine, difficulty } = req.body;

    if (!allowedCuisines.includes(cuisine)) {
      return res.status(400).json({
        message: `Cuisine must be one of: ${allowedCuisines.join(", ")}.`
      });
    }

    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({ message: "Difficulty must be Easy, Medium, or Hard." });
    }

    const storedIngredients = await getUserIngredients(req.user.userId);
    const ingredients = (Array.isArray(storedIngredients) ? storedIngredients : [])
      .map((ingredient) => ({
        ...ingredient,
        name: typeof ingredient?.name === "string" ? ingredient.name.trim() : ""
      }))
      .filter((ingredient) => ingredient.name.length > 0);

    if (ingredients.length === 0) {
      return res.status(400).json({ message: "Please add at least one ingredient." });
    }

    const hasDangerousIngredient = ingredients.some((ingredient) =>
      dangerousIngredientNames.has(ingredient.name.toLowerCase())
    );

    if (hasDangerousIngredient) {
      return res.status(400).json({
        message: "Some items may be unsafe to eat. Please remove them before generating recipes."
      });
    }

    const recipes = await generateRecipesWithDeepSeek({ ingredients, cuisine, difficulty });
    const recipesWithImages = await Promise.all(
      recipes.recipes.map(async (recipe) => ({
        ...recipe,
        imageUrl:
          imageProvider === "pexels"
            ? await fetchRecipeImageUrl({
                imagePrompt: recipe.imagePrompt,
                title: recipe.title
              })
            : ""
      }))
    );

    res.json({ recipes: recipesWithImages });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}
