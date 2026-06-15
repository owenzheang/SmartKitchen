import { useEffect, useState } from "react";
import { generateRecipes, getIngredients, saveRecipe } from "../services/api.js";

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
    <main className="app-page">
      <header className="app-header">
        <div>
          <h1>SMARTKITCHEN</h1>
          <p>Recipe Generation</p>
        </div>
      </header>

      <section className="page-stack">
        <section className="panel form-stack">
          <h2>Generate Recipes</h2>

          <label>
            Cuisine
            <select value={cuisine} onChange={(event) => setCuisine(event.target.value)}>
              <option value="Chinese">Chinese</option>
              <option value="Western">Western</option>
            </select>
          </label>

          <label>
            Preferred Difficulty
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          <button type="button" onClick={handleGenerate} disabled={isLoading || ingredients.length === 0}>
            {isLoading ? "Generating..." : "Generate Recipes"}
          </button>

          {ingredients.length === 0 && (
            <p className="message">Add ingredients before generating recipes.</p>
          )}
          {message && <p className="message">{message}</p>}
        </section>

        <section className="panel">
          <h2>Available Ingredients</h2>
          {ingredients.length === 0 ? (
            <p className="empty-state">No ingredients yet.</p>
          ) : (
            <ul className="compact-list">
              {ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.name} {ingredient.quantity ?? ""} {ingredient.unit ?? ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      {recipes.length > 0 && (
        <section className="recipe-results">
          <h2>Recommended Recipes</h2>
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <article key={recipe.title} className="panel recipe-card">
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

                <button
                  type="button"
                  onClick={() => handleSave(recipe)}
                  disabled={savingTitle === recipe.title}
                >
                  {savingTitle === recipe.title ? "Saving..." : "Save Recipe"}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default RecipeGenerationPage;
