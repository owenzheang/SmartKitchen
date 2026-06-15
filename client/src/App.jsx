import { useState } from "react";
import IngredientsPage from "./pages/IngredientsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import RecipeGenerationPage from "./pages/RecipeGenerationPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SavedRecipesPage from "./pages/SavedRecipesPage.jsx";
import { getToken, removeToken } from "./services/api.js";

function App() {
  const [page, setPage] = useState(getToken() ? "ingredients" : "login");
  const [selectedSavedRecipeId, setSelectedSavedRecipeId] = useState(null);

  function handleLogout() {
    removeToken();
    setSelectedSavedRecipeId(null);
    setPage("login");
  }

  function viewSavedRecipe(id) {
    setSelectedSavedRecipeId(id);
    setPage("recipeDetail");
  }

  function renderWithNavigation(content) {
    return (
      <div className="app-shell">
        <div className="phone-container">
          {content}
          <nav className="bottom-nav" aria-label="Main navigation">
            <button
              type="button"
              className={page === "ingredients" ? "active" : ""}
              onClick={() => setPage("ingredients")}
            >
              Ingredients
            </button>
            <button
              type="button"
              className={page === "recipes" ? "active" : ""}
              onClick={() => setPage("recipes")}
            >
              Generate
            </button>
            <button
              type="button"
              className={page === "savedRecipes" || page === "recipeDetail" ? "active" : ""}
              onClick={() => setPage("savedRecipes")}
            >
              Saved
            </button>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </div>
    );
  }

  if (page === "register") {
    return (
      <RegisterPage
        onRegister={() => setPage("ingredients")}
        onShowLogin={() => setPage("login")}
      />
    );
  }

  if (page === "recipes") {
    return renderWithNavigation(
      <RecipeGenerationPage
        onBack={() => setPage("ingredients")}
        onLogout={handleLogout}
        onSavedRecipes={() => setPage("savedRecipes")}
      />
    );
  }

  if (page === "savedRecipes") {
    return renderWithNavigation(
      <SavedRecipesPage
        onBack={() => setPage("ingredients")}
        onLogout={handleLogout}
        onViewRecipe={viewSavedRecipe}
      />
    );
  }

  if (page === "recipeDetail") {
    return renderWithNavigation(
      <RecipeDetailPage
        savedRecipeId={selectedSavedRecipeId}
        onBack={() => setPage("savedRecipes")}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "ingredients") {
    return renderWithNavigation(
      <IngredientsPage
        onGenerateRecipes={() => setPage("recipes")}
        onSavedRecipes={() => setPage("savedRecipes")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LoginPage
      onLogin={() => setPage("ingredients")}
      onShowRegister={() => setPage("register")}
    />
  );
}

export default App;
