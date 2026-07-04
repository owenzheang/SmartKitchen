import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ChefHat, Clock, Leaf } from "lucide-react";
import { getSavedRecipe } from "../services/api.js";

const pageMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }
};

const difficultyDotCounts = {
  Easy: 1,
  Medium: 2,
  Hard: 3
};

const leadingQuantityPattern =
  /^(\d+([./]\d+)?|\d+\s+\d+\/\d+)\s*(g|kg|mg|ml|l|oz|lb|lbs|cup|cups|tbsp|tsp|tablespoon|tablespoons|teaspoon|teaspoons|clove|cloves|piece|pieces|slice|slices|can|cans)?\s*/i;

function DifficultyDots({ difficulty }) {
  const level = difficulty || "Easy";
  const count = difficultyDotCounts[level] || 1;

  return (
    <span className={`difficulty-dots ${level.toLowerCase()}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index}></span>
      ))}
    </span>
  );
}

function formatIngredientName(ingredient) {
  const withoutQuantity = ingredient.replace(leadingQuantityPattern, "").trim();
  const name = withoutQuantity || ingredient;

  return name.charAt(0).toUpperCase() + name.slice(1);
}

function RecipeDetailPage({ savedRecipeId, recipe: generatedRecipe = null, onBack }) {
  const [savedRecipe, setSavedRecipe] = useState(
    generatedRecipe ? { recipe: generatedRecipe } : null
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (generatedRecipe) {
      setSavedRecipe({ recipe: generatedRecipe });
      return;
    }

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
  }, [savedRecipeId, generatedRecipe]);

  const recipe = savedRecipe?.recipe;

  return (
    <motion.main className="app-page recipe-detail-screen" {...pageMotion}>
      <motion.header
        className="recipe-detail-topbar"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
        <motion.button
          type="button"
          className="recipe-detail-back-button"
          aria-label="Back to saved recipes"
          onClick={onBack}
          whileTap={{ scale: 0.92 }}
        >
          <ArrowLeft size={23} strokeWidth={1.9} aria-hidden="true" />
        </motion.button>

        <div className="recipe-detail-titlebar">
          <span>CHEFSPARK</span>
          <h1>Recipe Detail</h1>
        </div>

        <div className="recipe-detail-logo" aria-hidden="true">
          <ChefHat size={21} strokeWidth={1.8} />
        </div>
      </motion.header>

      {isLoading && <p className="message">Loading recipe...</p>}
      {message && <p className="message error">{message}</p>}

      {recipe && (
        <motion.article
          className="recipe-detail-layout"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <section
            className={recipe.imageUrl ? "recipe-detail-image-placeholder has-image" : "recipe-detail-image-placeholder"}
            aria-label="Recipe image"
          >
            {recipe.imageUrl && (
              <img src={recipe.imageUrl} alt={recipe.title} />
            )}
            <span>{recipe.cuisine}</span>
          </section>

          <section className="recipe-detail-summary-card">
            <div className="recipe-detail-badges">
              <span className="recipe-cuisine-badge">{recipe.cuisine}</span>
              <span className="recipe-difficulty-badge">
                <DifficultyDots difficulty={recipe.difficulty} />
                {recipe.difficulty}
              </span>
            </div>

            <h2>{recipe.title}</h2>

            <div className="recipe-detail-info-grid" aria-label="Recipe information">
              <article>
                <Clock size={18} strokeWidth={1.9} aria-hidden="true" />
                <strong>{recipe.cookTime}</strong>
                <span>Cook time</span>
              </article>
            </div>
          </section>

          <section className="recipe-detail-section">
            <div className="recipe-detail-section-heading">
              <span aria-hidden="true">
                <Leaf size={15} strokeWidth={2} />
              </span>
              <h3>Ingredients</h3>
              <strong>{recipe.ingredients.length}</strong>
            </div>

            <ul className="recipe-detail-ingredient-list">
              {recipe.ingredients.map((ingredient, index) => (
                <motion.li
                  key={ingredient}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.18 }}
                >
                  {formatIngredientName(ingredient)}
                </motion.li>
              ))}
            </ul>
          </section>

          <section className="recipe-detail-section">
            <div className="recipe-detail-section-heading">
              <span aria-hidden="true">
                <ChefHat size={15} strokeWidth={2} />
              </span>
              <h3>Steps</h3>
            </div>

            <ol className="recipe-detail-step-list">
              {recipe.steps.map((step, index) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                >
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </motion.li>
              ))}
            </ol>
          </section>
        </motion.article>
      )}
    </motion.main>
  );
}

export default RecipeDetailPage;
