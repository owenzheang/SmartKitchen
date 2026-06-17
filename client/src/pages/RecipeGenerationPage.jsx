import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ChefHat,
  Check,
  ChevronDown,
  Leaf,
  Sparkles,
  Utensils,
  X
} from "lucide-react";
import { generateRecipes, getIngredients, saveRecipe } from "../services/api.js";

const pageMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }
};

const cardMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.28 }
};

const cuisineOptions = [
  {
    name: "Chinese",
    emoji: "🥢",
    description: "Stir-fries, dumplings & more"
  },
  {
    name: "Western",
    emoji: "🍝",
    description: "Pasta, burgers & roasts"
  }
];

function RecipeGenerationPage() {
  const [ingredients, setIngredients] = useState([]);
  const [cuisine, setCuisine] = useState("Chinese");
  const [difficulty, setDifficulty] = useState("Easy");
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingTitle, setSavingTitle] = useState("");

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await getIngredients();
        setIngredients(data);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadIngredients();
  }, []);

  async function handleGenerate() {
    setMessage("");
    setRecipes([]);
    setIsLoading(true);

    try {
      const data = await generateRecipes({ cuisine, difficulty });
      setRecipes(data.recipes);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(recipe) {
    setMessage("");
    setSavingTitle(recipe.title);

    try {
      await saveRecipe(recipe);
      setMessage(`Saved ${recipe.title}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingTitle("");
    }
  }

  return (
    <motion.main className="app-page generate-screen" {...pageMotion}>
      <motion.header
        className="generate-topbar"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
        <motion.button
          className="generate-back-button"
          type="button"
          aria-label="Back"
          whileTap={{ scale: 0.92 }}
        >
          <ArrowLeft size={24} strokeWidth={1.9} aria-hidden="true" />
        </motion.button>

        <div className="generate-title">
          <span>SMARTKITCHEN</span>
          <h1>Generate Recipes</h1>
        </div>

        <div className="generate-logo" aria-hidden="true">
          <ChefHat size={22} strokeWidth={1.8} />
        </div>
      </motion.header>

      <motion.section
        className="generate-steps"
        aria-label="Recipe generation steps"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.34 }}
      >
        <div className="generate-step complete">
          <span><Check size={16} strokeWidth={2.4} aria-hidden="true" /></span>
          <strong>Ingredients</strong>
        </div>
        <div className="generate-step-line"></div>
        <div className="generate-step active">
          <span>2</span>
          <strong>Generate</strong>
        </div>
      </motion.section>

      <motion.section className="generate-ingredients-card" {...cardMotion}>
        <div className="generate-card-heading">
          <span className="generate-leaf-icon" aria-hidden="true">
            <Leaf size={18} strokeWidth={1.8} />
          </span>
          <h2>Your ingredients</h2>
          <strong>{ingredients.length} items</strong>
        </div>

        {ingredients.length === 0 ? (
          <p className="empty-state">No ingredients yet.</p>
        ) : (
          <ul className="generate-ingredient-chips">
            {ingredients.map((ingredient) => (
              <motion.li
                key={ingredient.id}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
              >
                {ingredient.name}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.section>

      <motion.section
        className="cuisine-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.42 }}
      >
        <div className="cuisine-card-title">
          <span aria-hidden="true"><Utensils size={22} strokeWidth={1.9} /></span>
          <div>
            <h2>Cuisine Style</h2>
            <p>Pick one cuisine style</p>
          </div>
        </div>

        <div className="cuisine-options">
          {cuisineOptions.map((option) => {
            const isSelected = cuisine === option.name;

            return (
              <motion.button
                key={option.name}
                type="button"
                className={isSelected ? "cuisine-option selected" : "cuisine-option"}
                onClick={() => setCuisine(option.name)}
                whileTap={{ scale: 0.97 }}
              >
                <span className="cuisine-icon" aria-hidden="true">{option.emoji}</span>
                <span>
                  <strong>{option.name}</strong>
                  <small>{option.description}</small>
                </span>
                <span className="cuisine-check">
                  {isSelected ? (
                    <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    <X size={14} strokeWidth={2.4} aria-hidden="true" />
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>

        <label className="difficulty-control">
          <span>Difficulty</span>
          <div className="difficulty-select-shell">
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true" />
          </div>
        </label>

        <p className="selected-cuisine-count">1 cuisine selected</p>
      </motion.section>

      <motion.button
        className="generate-recipes-button"
        type="button"
        onClick={handleGenerate}
        disabled={isLoading || ingredients.length === 0}
        whileTap={{ scale: 0.97 }}
      >
        <Sparkles size={24} strokeWidth={1.9} aria-hidden="true" />
        {isLoading ? "Generating..." : "Generate Recipes"}
      </motion.button>

      {ingredients.length === 0 && (
        <p className="message">Add ingredients before generating recipes.</p>
      )}
      {message && <p className="message">{message}</p>}

      <AnimatePresence>
        {recipes.length > 0 && (
          <motion.section
            className="recipe-results generate-results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2>Recommended Recipes</h2>
            <div className="recipe-grid">
              {recipes.map((recipe, index) => (
                <motion.article
                  key={recipe.title}
                  className="panel recipe-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                >
                <div className="recipe-card-header">
                  <h3>{recipe.title}</h3>
                  <span>{recipe.matchScore}% match</span>
                </div>
                <p>{recipe.cuisine} | {recipe.difficulty} | {recipe.cookTime}</p>

                <h4>Missing Ingredients</h4>
                <p>{recipe.missingIngredients.length > 0 ? recipe.missingIngredients.join(", ") : "None"}</p>

                <h4>Ingredients</h4>
                <ul>
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>

                <h4>Steps</h4>
                <ol>
                  {recipe.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>

                <motion.button
                  type="button"
                  onClick={() => handleSave(recipe)}
                  disabled={savingTitle === recipe.title}
                  whileTap={{ scale: 0.97 }}
                >
                  {savingTitle === recipe.title ? "Saving..." : "Save Recipe"}
                </motion.button>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

export default RecipeGenerationPage;
