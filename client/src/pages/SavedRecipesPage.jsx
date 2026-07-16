import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Clock, Trash2 } from "lucide-react";
import RecipePlaceholderHeader from "../components/RecipePlaceholderHeader.jsx";
import { deleteSavedRecipe, getSavedRecipes } from "../services/api.js";

const pageMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }
};

function formatSavedDate(savedAt) {
  const savedDate = new Date(savedAt);

  if (Number.isNaN(savedDate.getTime())) {
    return "Saved recently";
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfSavedDate = new Date(
    savedDate.getFullYear(),
    savedDate.getMonth(),
    savedDate.getDate()
  );
  const dayDifference = Math.round((startOfToday - startOfSavedDate) / 86400000);

  if (dayDifference === 0) {
    return "today";
  }

  if (dayDifference > 0 && dayDifference < 7) {
    return `${dayDifference}d ago`;
  }

  return savedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatCookTime(cookTime) {
  return cookTime.replace(/\bminutes\b/i, "min").replace(/\bminute\b/i, "min");
}

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

function SavedRecipesPage({ onBack, onViewRecipe, onRecipeDeleted }) {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(new Set());

  async function loadSavedRecipes() {
    setMessage("");
    setIsLoading(true);

    try {
      const data = await getSavedRecipes();
      setSavedRecipes(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  async function handleDelete(savedRecipe) {
    if (pendingDeleteIds.has(savedRecipe.id)) {
      return;
    }

    setMessage("");
    setPendingDeleteIds((currentIds) => new Set(currentIds).add(savedRecipe.id));

    try {
      await deleteSavedRecipe(savedRecipe.id);
      setSavedRecipes((currentRecipes) =>
        currentRecipes.filter((currentRecipe) => currentRecipe.id !== savedRecipe.id)
      );
      onRecipeDeleted?.(savedRecipe);
      setMessage("Saved recipe deleted.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPendingDeleteIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(savedRecipe.id);
        return nextIds;
      });
    }
  }

  return (
    <motion.main className="app-page saved-screen" {...pageMotion}>
      <motion.header
        className="saved-topbar"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
        <motion.button
          className="saved-back-button"
          type="button"
          aria-label="Back"
          onClick={onBack}
          whileTap={{ scale: 0.92 }}
        >
          <ArrowLeft size={24} strokeWidth={1.9} aria-hidden="true" />
        </motion.button>

        <div className="saved-title">
          <span>CHEFSPARK</span>
          <h1>Saved Recipes</h1>
        </div>

      </motion.header>

      <motion.p
        className="saved-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.34 }}
      >
        <strong>{savedRecipes.length} {savedRecipes.length === 1 ? "recipe" : "recipes"}</strong>
        {" "}saved in your collection
      </motion.p>

      {isLoading && <p className="message">Loading saved recipes...</p>}
      {message && <p className="message">{message}</p>}

      <AnimatePresence>
        {!isLoading && savedRecipes.length === 0 && (
          <motion.section
            className="saved-empty-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <p>No saved recipes yet.</p>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.section className="saved-card-list" layout>
        <AnimatePresence initial={false}>
        {savedRecipes.map((savedRecipe) => {
          const recipe = savedRecipe.recipe;
          const matchScore = recipe.matchScore ?? 0;

          return (
            <motion.article
              key={savedRecipe.id}
              className="saved-recipe-card"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -36, transition: { duration: 0.22 } }}
            >
              <RecipePlaceholderHeader
                title={recipe.title}
                cuisine={recipe.cuisine}
                matchScore={matchScore}
                savedLabel={formatSavedDate(savedRecipe.savedAt)}
                variant="saved"
              />

              <div className="saved-card-body">
                <div className="saved-tags">
                  <span>{recipe.cuisine}</span>
                </div>

                <h2>{recipe.title}</h2>

                <div className="saved-meta">
                  <span><Clock size={15} strokeWidth={1.9} aria-hidden="true" /> {formatCookTime(recipe.cookTime)}</span>
                  <span className="difficulty-indicator">
                    <DifficultyDots difficulty={recipe.difficulty} />
                    {recipe.difficulty}
                  </span>
                </div>

                <div className="saved-card-actions">
                  <motion.button
                    type="button"
                    className="saved-delete-button"
                    aria-label={
                      pendingDeleteIds.has(savedRecipe.id)
                        ? `Deleting ${recipe.title}`
                        : `Delete ${recipe.title}`
                    }
                    onClick={() => handleDelete(savedRecipe)}
                    disabled={pendingDeleteIds.has(savedRecipe.id)}
                    whileTap={{ scale: 0.92 }}
                  >
                    <Trash2 size={21} strokeWidth={1.9} aria-hidden="true" />
                  </motion.button>

                  <motion.button
                    type="button"
                    className="saved-view-button"
                    onClick={() => onViewRecipe(savedRecipe.id)}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Detail
                  </motion.button>
                </div>
              </div>
            </motion.article>
          );
        })}
        </AnimatePresence>
      </motion.section>
    </motion.main>
  );
}

export default SavedRecipesPage;
