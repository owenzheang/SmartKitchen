import { useEffect, useState } from "react";
import { deleteSavedRecipe, getSavedRecipes } from "../services/api.js";

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
    return "Saved today";
  }

  if (dayDifference === 1) {
    return "Saved yesterday";
  }

  return savedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getMatchClass(matchScore) {
  if (matchScore >= 90) {
    return "high";
  }

  if (matchScore >= 70) {
    return "medium";
  }

  return "low";
}

function SavedRecipesPage({ onViewRecipe }) {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  async function handleDelete(id) {
    setMessage("");

    try {
      await deleteSavedRecipe(id);
      setMessage("Saved recipe deleted.");
      await loadSavedRecipes();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="app-page saved-screen">
      <header className="saved-topbar">
        <button className="saved-back-button" type="button" aria-label="Back">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18 9 12l6-6" />
            <path d="M9 12h12" />
          </svg>
        </button>

        <div className="saved-title">
          <span>SMARTKITCHEN</span>
          <h1>Saved Recipes</h1>
        </div>

        <div className="saved-bookmark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 4h10v16l-5-3-5 3V4Z" />
          </svg>
        </div>
      </header>

      <p className="saved-summary">
        <strong>{savedRecipes.length} {savedRecipes.length === 1 ? "recipe" : "recipes"}</strong>
        {" "}saved in your collection
      </p>

      {isLoading && <p className="message">Loading saved recipes...</p>}
      {message && <p className="message">{message}</p>}

      {!isLoading && savedRecipes.length === 0 && (
        <section className="saved-empty-card">
          <p>No saved recipes yet.</p>
        </section>
      )}

      <section className="saved-card-list">
        {savedRecipes.map((savedRecipe) => {
          const recipe = savedRecipe.recipe;
          const matchScore = recipe.matchScore ?? 0;

          return (
            <article key={savedRecipe.id} className="saved-recipe-card">
              <div className="saved-image-placeholder">
                <span className={`match-badge ${getMatchClass(matchScore)}`}>
                  {matchScore}% match
                </span>
                <span className="saved-date-badge">{formatSavedDate(savedRecipe.savedAt)}</span>
              </div>

              <div className="saved-card-body">
                <div className="saved-tags">
                  <span>{recipe.cuisine}</span>
                  <span>{recipe.difficulty}</span>
                </div>

                <h2>{recipe.title}</h2>

                <div className="saved-meta">
                  <span>{recipe.cookTime}</span>
                  <span>{recipe.difficulty}</span>
                </div>

                <div className="saved-card-actions">
                  <button
                    type="button"
                    className="saved-delete-button"
                    aria-label={`Delete ${recipe.title}`}
                    onClick={() => handleDelete(savedRecipe.id)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7h16" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M6 7l1 14h10l1-14" />
                      <path d="M9 7V4h6v3" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="saved-view-button"
                    onClick={() => onViewRecipe(savedRecipe.id)}
                  >
                    View Detail
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default SavedRecipesPage;
