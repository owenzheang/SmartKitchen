import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getSavedRecipe } from "../services/api.js";

const pageMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }
};

function RecipeDetailPage({ savedRecipeId, onBack }) {
  const [savedRecipe, setSavedRecipe] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadRecipe() {
      setMessage("");
      setIsLoading(true);

      try {
        const data = await getSavedRecipe(savedRecipeId);
        setSavedRecipe(data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipe();
  }, [savedRecipeId]);

  const recipe = savedRecipe?.recipe;

  return (
    <motion.main className="app-page" {...pageMotion}>
      <motion.header
        className="app-header compact-header"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
        <motion.button
          type="button"
          className="back-button"
          onClick={onBack}
          whileTap={{ scale: 0.94 }}
        >
          Back
        </motion.button>
        <div>
          <h1>SMARTKITCHEN</h1>
          <p>Recipe Detail</p>
        </div>
      </motion.header>

      {isLoading && <p className="message">Loading recipe...</p>}
      {message && <p className="message error">{message}</p>}

      {recipe && (
        <motion.article
          className="panel recipe-detail"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <div className="recipe-card-header">
            <h2>{recipe.title}</h2>
            <span>{recipe.matchScore}% match</span>
          </div>

          <p>{recipe.cuisine} | {recipe.difficulty} | {recipe.cookTime}</p>
          <p>Saved: {savedRecipe.savedAt}</p>

          <h3>Missing Ingredients</h3>
          <p>{recipe.missingIngredients.length > 0 ? recipe.missingIngredients.join(", ") : "None"}</p>

          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <motion.li
                key={ingredient}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.18 }}
              >
                {ingredient}
              </motion.li>
            ))}
          </ul>

          <h3>Steps</h3>
          <ol>
            {recipe.steps.map((step, index) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.18 }}
              >
                {step}
              </motion.li>
            ))}
          </ol>
        </motion.article>
      )}
    </motion.main>
  );
}

export default RecipeDetailPage;
