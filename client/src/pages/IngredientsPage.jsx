import { useEffect, useState } from "react";
import {
  addIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient
} from "../services/api.js";

const emptyForm = {
  name: "",
  quantity: "",
  unit: ""
};

function IngredientsPage({ onGenerateRecipes, onSavedRecipes, onLogout }) {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
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

  function updateForm(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const ingredientData = {
      name: form.name,
      quantity: form.quantity === "" ? null : Number(form.quantity),
      unit: form.unit
    };

    try {
      if (editingId) {
        await updateIngredient(editingId, ingredientData);
        setMessage("Ingredient updated.");
      } else {
        await addIngredient(ingredientData);
        setMessage("Ingredient added.");
      }

      resetForm();
      await loadIngredients();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function startEditing(ingredient) {
    setEditingId(ingredient.id);
    setForm({
      name: ingredient.name,
      quantity: ingredient.quantity ?? "",
      unit: ingredient.unit ?? ""
    });
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
    <main className="app-page">
      <header className="app-header">
        <div>
          <h1>SMARTKITCHEN</h1>
          <p>My Ingredients</p>
        </div>
        <div className="button-row">
          <button type="button" onClick={onGenerateRecipes}>Generate Recipes</button>
          <button type="button" className="secondary-button" onClick={onSavedRecipes}>Saved Recipes</button>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="content-grid">
        <form className="panel form-stack" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Ingredient" : "Add Ingredient"}</h2>

          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              required
            />
          </label>

          <label>
            Quantity
            <input
              type="number"
              step="0.01"
              value={form.quantity}
              onChange={(event) => updateForm("quantity", event.target.value)}
            />
          </label>

          <label>
            Unit
            <input
              type="text"
              value={form.unit}
              onChange={(event) => updateForm("unit", event.target.value)}
              placeholder="Pieces, grams, cups"
            />
          </label>

          <div className="button-row">
            <button type="submit">{editingId ? "Update" : "Add"}</button>
            {editingId && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="panel">
          <h2>Ingredient List</h2>
          {isLoading && <p className="message">Loading ingredients...</p>}
          {message && <p className="message">{message}</p>}

          {!isLoading && ingredients.length === 0 && (
            <p className="empty-state">No ingredients yet.</p>
          )}

          <ul className="ingredient-list">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id} className="ingredient-item">
                <div>
                  <strong>{ingredient.name}</strong>
                  <span>
                    {ingredient.quantity ?? ""} {ingredient.unit ?? ""}
                  </span>
                </div>
                <div className="button-row">
                  <button type="button" onClick={() => startEditing(ingredient)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(ingredient.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}

export default IngredientsPage;
