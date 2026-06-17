import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  ChefHat,
  Leaf,
  Plus,
  Search,
  Sparkles,
  X
} from "lucide-react";
import {
  addIngredient,
  deleteIngredient,
  getIngredients
} from "../services/api.js";

const emptyForm = {
  name: ""
};

const popularIngredients = [
  "Eggs",
  "Tomato",
  "Garlic",
  "Onion",
  "Rice",
  "Chicken",
  "Pasta",
  "Potato",
  "Spinach",
  "Carrot",
  "Mushroom",
  "Bell Pepper",
  "Tofu",
  "Soy Sauce",
  "Ginger"
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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  const visiblePopularIngredients = popularIngredients
    .filter((ingredient) => !ingredientNames.includes(ingredient))
    .slice(0, 8);

  return (
    <main className="app-page ingredients-screen">
      <div className="ingredients-bg-blob top" aria-hidden="true"></div>
      <div className="ingredients-bg-blob bottom" aria-hidden="true"></div>

      <header className="ingredients-topbar">
        <div className="ingredients-logo" aria-hidden="true">
          <ChefHat size={18} strokeWidth={1.8} />
        </div>

        <div className="ingredients-greeting">
          <span>SMARTKITCHEN</span>
          <h1>{greeting}, Chef!</h1>
        </div>

        <button className="notification-button" type="button" aria-label="Notifications">
          <Bell size={17} strokeWidth={1.8} aria-hidden="true" />
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
          <Sparkles size={20} strokeWidth={1.8} />
        </div>
        <div>
          <h2>What's in your kitchen?</h2>
          <p>Add your ingredients and I'll find recipes</p>
        </div>
      </section>

      <section className="ingredients-card">
        <div className="ingredients-card-title">
          <span className="leaf-icon" aria-hidden="true">
            <Leaf size={14} strokeWidth={2} />
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
                  <X size={9} strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p className="empty-state">No ingredients yet.</p>
        )}

        <form className="ingredient-search-form" onSubmit={handleSubmit}>
          <Search size={15} strokeWidth={1.8} aria-hidden="true" />
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ name: event.target.value })}
            placeholder="Search or type an ingredient..."
            required
          />
          <button type="submit" aria-label="Add ingredient">
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </form>
      </section>

      <section className="popular-section">
        <h2>Popular</h2>
        <div className="popular-chip-list">
          {visiblePopularIngredients.map((ingredient) => (
            <button
              key={ingredient}
              type="button"
              onClick={() => addIngredientByName(ingredient)}
            >
              <Plus size={11} strokeWidth={2.5} aria-hidden="true" />
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
        <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </main>
  );
}

export default IngredientsPage;
