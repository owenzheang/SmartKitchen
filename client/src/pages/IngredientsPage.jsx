import { useEffect, useState } from "react";
import {
  addIngredient,
  deleteIngredient,
  getIngredients
} from "../services/api.js";

const emptyForm = {
  name: ""
};

const popularIngredients = [
  "Onion",
  "Rice",
  "Chicken",
  "Pasta",
  "Potato",
  "Spinach",
  "Carrot",
  "Mushroom"
];

function IngredientsPage({ onGenerateRecipes }) {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadIngredients() {
    setMessage("");
    setIsLoading(true);

    try {
      const data = await getIngredients();
      setIngredients(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadIngredients();
  }, []);

  function resetForm() {
    setForm(emptyForm);
  }

  async function addIngredientByName(name) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const ingredientData = {
      name: trimmedName,
      quantity: null,
      unit: ""
    };

    try {
      await addIngredient(ingredientData);
      setMessage("Ingredient added.");
      resetForm();
      await loadIngredients();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    await addIngredientByName(form.name);
  }

  async function handleDelete(id) {
    setMessage("");

    try {
      await deleteIngredient(id);
      setMessage("Ingredient deleted.");
      await loadIngredients();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="app-page ingredients-screen">
      <header className="ingredients-topbar">
        <div className="ingredients-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7.5 11.5c-1.3-.5-2.2-1.7-2.2-3.2A3.4 3.4 0 0 1 8.7 5c.7 0 1.3.2 1.8.5A4.2 4.2 0 0 1 18.3 8c1.4.6 2.4 1.9 2.4 3.5 0 1.8-1.2 3.3-2.8 3.8V20H7.5v-8.5Z" />
            <path d="M7.5 16h10.4" />
          </svg>
        </div>

        <div className="ingredients-greeting">
          <span>SMARTKITCHEN</span>
          <h1>Good afternoon, Chef!</h1>
        </div>

        <button className="notification-button" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
          <span></span>
        </button>
      </header>

      <section className="ingredient-steps" aria-label="Recipe creation steps">
        <div className="step-item active">
          <span>1</span>
          <strong>Ingredients</strong>
        </div>
        <div className="step-line"></div>
        <div className="step-item">
          <span>2</span>
          <strong>Generate</strong>
        </div>
      </section>

      <section className="ingredients-hero">
        <div className="hero-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3l1.6 5.1L19 10l-5.4 1.9L12 17l-1.6-5.1L5 10l5.4-1.9L12 3Z" />
            <path d="M19 4v4M21 6h-4" />
          </svg>
        </div>
        <div>
          <h2>What's in your kitchen?</h2>
          <p>Add your ingredients and I'll find recipes</p>
        </div>
      </section>

      <section className="ingredients-card">
        <div className="ingredients-card-title">
          <span className="leaf-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14Z" />
              <path d="M5 19c3-5 6-8 10-10" />
            </svg>
          </span>
          <h2>My Ingredients</h2>
          <strong>{ingredients.length}</strong>
        </div>

        {isLoading && <p className="message">Loading ingredients...</p>}
        {message && <p className="message">{message}</p>}

        {ingredients.length > 0 ? (
          <ul className="ingredient-chip-list">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <span>{ingredient.name}</span>
                <button
                  type="button"
                  aria-label={`Delete ${ingredient.name}`}
                  onClick={() => handleDelete(ingredient.id)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p className="empty-state">No ingredients yet.</p>
        )}

        <form className="ingredient-search-form" onSubmit={handleSubmit}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.3-4.3" />
            <circle cx="11" cy="11" r="7" />
          </svg>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ name: event.target.value })}
            placeholder="Search or type an ingredient..."
            required
          />
          <button type="submit" aria-label="Add ingredient">
            +
          </button>
        </form>
      </section>

      <section className="popular-section">
        <h2>Popular</h2>
        <div className="popular-chip-list">
          {popularIngredients.map((ingredient) => (
            <button
              key={ingredient}
              type="button"
              onClick={() => addIngredientByName(ingredient)}
            >
              <span>+</span>
              {ingredient}
            </button>
          ))}
        </div>
      </section>

      <section className="ingredient-stats" aria-label="Kitchen statistics">
        <article>
          <strong>12</strong>
          <span>Recipes saved</span>
        </article>
        <article>
          <strong>4</strong>
          <span>Cooked this week</span>
        </article>
        <article>
          <strong>{ingredients.length}</strong>
          <span>Ingredients</span>
        </article>
      </section>

      <button className="choose-cuisine-button" type="button" onClick={onGenerateRecipes}>
        Choose Cuisine
        <span aria-hidden="true">=&gt;</span>
      </button>
    </main>
  );
}

export default IngredientsPage;
