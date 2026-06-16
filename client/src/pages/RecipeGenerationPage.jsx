import { useEffect, useState } from "react";
import { generateRecipes, getIngredients, saveRecipe } from "../services/api.js";

const cuisineOptions = [
  {
    name: "Chinese",
    icon: "//",
    description: "Stir-fries, dumplings & more"
  },
  {
    name: "Western",
    icon: "W",
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
    <main className="app-page generate-screen">
      <header className="generate-topbar">
        <button className="generate-back-button" type="button" aria-label="Back">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18 9 12l6-6" />
            <path d="M9 12h12" />
          </svg>
        </button>

        <div className="generate-title">
          <span>SMARTKITCHEN</span>
          <h1>Generate Recipes</h1>
        </div>

        <div className="generate-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7.5 11.5c-1.3-.5-2.2-1.7-2.2-3.2A3.4 3.4 0 0 1 8.7 5c.7 0 1.3.2 1.8.5A4.2 4.2 0 0 1 18.3 8c1.4.6 2.4 1.9 2.4 3.5 0 1.8-1.2 3.3-2.8 3.8V20H7.5v-8.5Z" />
            <path d="M7.5 16h10.4" />
          </svg>
        </div>
      </header>

      <section className="generate-steps" aria-label="Recipe generation steps">
        <div className="generate-step complete">
          <span>✓</span>
          <strong>Ingredients</strong>
        </div>
        <div className="generate-step-line"></div>
        <div className="generate-step active">
          <span>2</span>
          <strong>Generate</strong>
        </div>
      </section>

      <section className="generate-ingredients-card">
        <div className="generate-card-heading">
          <span className="generate-leaf-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14Z" />
              <path d="M5 19c3-5 6-8 10-10" />
            </svg>
          </span>
          <h2>Your ingredients</h2>
          <strong>{ingredients.length} items</strong>
        </div>

        {ingredients.length === 0 ? (
          <p className="empty-state">No ingredients yet.</p>
        ) : (
          <ul className="generate-ingredient-chips">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="cuisine-card">
        <div className="cuisine-card-title">
          <span aria-hidden="true">Ψ</span>
          <div>
            <h2>Cuisine Style</h2>
            <p>Pick one cuisine style</p>
          </div>
        </div>

        <div className="cuisine-options">
          {cuisineOptions.map((option) => {
            const isSelected = cuisine === option.name;

            return (
              <button
                key={option.name}
                type="button"
                className={isSelected ? "cuisine-option selected" : "cuisine-option"}
                onClick={() => setCuisine(option.name)}
              >
                <span className="cuisine-icon">{option.icon}</span>
                <span>
                  <strong>{option.name}</strong>
                  <small>{option.description}</small>
                </span>
                <span className="cuisine-check">{isSelected ? "✓" : "×"}</span>
              </button>
            );
          })}
        </div>

        <label className="difficulty-control">
          Difficulty
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <p className="selected-cuisine-count">1 cuisine selected</p>
      </section>

      <button
        className="generate-recipes-button"
        type="button"
        onClick={handleGenerate}
        disabled={isLoading || ingredients.length === 0}
      >
        <span aria-hidden="true">✧</span>
        {isLoading ? "Generating..." : "Generate Recipes"}
      </button>

      {ingredients.length === 0 && (
        <p className="message">Add ingredients before generating recipes.</p>
      )}
      {message && <p className="message">{message}</p>}

      {recipes.length > 0 && (
        <section className="recipe-results generate-results">
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
