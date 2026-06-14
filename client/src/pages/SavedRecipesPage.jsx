import { useEffect, useState } from "react";
import { deleteSavedRecipe, getSavedRecipes } from "../services/api.js";

function SavedRecipesPage({ onBack, onLogout, onViewRecipe }) {
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
    <main className="app-page">
      <header className="app-header">
        <div>
          <h1>SMARTKITCHEN</h1>
          <p>Saved Recipes</p>
        </div>
        <div className="button-row">
          <button type="button" className="secondary-button" onClick={onBack}>
            Ingredients
          </button>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="panel">
        <h2>My Saved Recipes</h2>
        {isLoading && <p className="message">Loading saved recipes...</p>}
        {message && <p className="message">{message}</p>}

        {!isLoading && savedRecipes.length === 0 && (
          <p className="empty-state">No saved recipes yet.</p>
        )}

        <ul className="saved-recipe-list">
          {savedRecipes.map((savedRecipe) => (
            <li key={savedRecipe.id} className="saved-recipe-item">
              <div>
                <strong>{savedRecipe.recipe.title}</strong>
                <span>
                  {savedRecipe.recipe.cuisine} | {savedRecipe.recipe.difficulty} | {savedRecipe.recipe.cookTime}
                </span>
                <span>Saved: {savedRecipe.savedAt}</span>
              </div>
              <div className="button-row">
                <button type="button" onClick={() => onViewRecipe(savedRecipe.id)}>
                  View
                </button>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => handleDelete(savedRecipe.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default SavedRecipesPage;
