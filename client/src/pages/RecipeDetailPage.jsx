import { useEffect, useState } from "react";
import { getSavedRecipe } from "../services/api.js";

function RecipeDetailPage({ savedRecipeId, onBack, onLogout }) {
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
    <main className="app-page">
      <header className="app-header">
        <div>
          <h1>SMARTKITCHEN</h1>
          <p>Recipe Detail</p>
        </div>
        <div className="button-row">
          <button type="button" className="secondary-button" onClick={onBack}>
            Saved Recipes
          </button>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {isLoading && <p className="message">Loading recipe...</p>}
      {message && <p className="message error">{message}</p>}

      {recipe && (
        <article className="panel recipe-detail">
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
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>

          <h3>Steps</h3>
          <ol>
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      )}
    </main>
  );
}

export default RecipeDetailPage;
