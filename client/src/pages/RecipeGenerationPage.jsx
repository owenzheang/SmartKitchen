import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  BookmarkPlus,
  ChefHat,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Leaf,
  ShoppingCart,
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
    name: "Japanese",
    emoji: "🍱",
    description: "Ramen, sushi & bento"
  },
  {
    name: "Western",
    emoji: "🍝",
    description: "Pasta, burgers & roasts"
  },
  {
    name: "Korean",
    emoji: "🍲",
    description: "Bibimbap, BBQ & stews"
  },
  {
    name: "Indian",
    emoji: "🍛",
    description: "Curries, rice & breads"
  },
  {
    name: "Thai",
    emoji: "🌾",
    description: "Pad thai, soups & salads"
  }
];

const difficultyDotCounts = {
  Easy: 1,
  Medium: 2,
  Hard: 3
};

function DifficultyDots({ difficulty }) {
  const count = difficultyDotCounts[difficulty] || 1;

  return (
    <span className={`difficulty-dots ${difficulty.toLowerCase()}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index}></span>
      ))}
    </span>
  );
}

function RecipeGenerationPage({
  onBack,
  generatedRecipes,
  setGeneratedRecipes,
  onViewRecipe
}) {
  const [ingredients, setIngredients] = useState([]);
  const [cuisine, setCuisine] = useState("Chinese");
  const [difficulty, setDifficulty] = useState("Easy");
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
    setGeneratedRecipes([]);
    setIsLoading(true);

    try {
      const data = await generateRecipes({ cuisine, difficulty });
      setGeneratedRecipes(data.recipes);
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
          onClick={onBack}
          whileTap={{ scale: 0.92 }}
        >
          <ArrowLeft size={24} strokeWidth={1.9} aria-hidden="true" />
        </motion.button>

        <div className="generate-title">
          <span>CHEFSPARK</span>
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
        <div className="progress-step complete">
          <span><Check size={16} strokeWidth={2.4} aria-hidden="true" /></span>
          <strong>Ingredients</strong>
        </div>
        <div className="progress-step-line"></div>
        <div className="progress-step active">
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
          <span aria-hidden="true"><Utensils size={18} strokeWidth={1.9} /></span>
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
        {generatedRecipes.length > 0 && (
          <motion.section
            className="recipe-results generate-results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2>Recommended Recipes</h2>
            <div className="recipe-grid">
              {generatedRecipes.map((recipe, index) => (
                <motion.article
                  key={recipe.title}
                  className="panel recipe-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                >
                <div className={recipe.imageUrl ? "recipe-card-image has-image" : "recipe-card-image"}>
                  {recipe.imageUrl && (
                    <img src={recipe.imageUrl} alt={recipe.title} />
                  )}
                  <span className="recipe-match-badge">{recipe.matchScore}% match</span>
                  <motion.button
                    type="button"
                    className="recipe-save-icon"
                    aria-label={`Save ${recipe.title}`}
                    title={savingTitle === recipe.title ? "Saving recipe" : "Save recipe"}
                    onClick={() => handleSave(recipe)}
                    disabled={savingTitle === recipe.title}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BookmarkPlus size={18} strokeWidth={2} aria-hidden="true" />
                  </motion.button>
                </div>

                <div className="recipe-card-header">
                  <h3>{recipe.title}</h3>
                </div>
                <p className="recipe-card-meta">
                  <span>{recipe.cuisine}</span>
                  <span className="meta-separator">|</span>
                  <span className="difficulty-indicator">
                    <DifficultyDots difficulty={recipe.difficulty} />
                    {recipe.difficulty}
                  </span>
                  <span className="meta-separator">|</span>
                  <span className="recipe-cook-time">
                    <Clock size={14} strokeWidth={2} aria-hidden="true" />
                    {recipe.cookTime}
                  </span>
                </p>

                {recipe.missingIngredients.length === 0 ? (
                  <div className="ingredient-status available">
                    <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
                    <strong>You have all the ingredients!</strong>
                  </div>
                ) : (
                  <div className="ingredient-status missing">
                    <div className="ingredient-status-heading">
                      <ShoppingCart size={17} strokeWidth={2.1} aria-hidden="true" />
                      <strong>Missing ingredients</strong>
                    </div>
                    <div className="missing-ingredient-chips">
                      {recipe.missingIngredients.map((ingredient) => (
                        <span key={ingredient}>{ingredient}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="recipe-card-actions">
                  <motion.button
                    type="button"
                    className="view-recipe-button"
                    onClick={() => onViewRecipe(recipe)}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Recipe
                  </motion.button>
                </div>
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
