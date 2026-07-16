import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { Bookmark, ChefHat, LogOut, Package } from "lucide-react";
import IngredientsPage from "./pages/IngredientsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import RecipeGenerationPage from "./pages/RecipeGenerationPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SavedRecipesPage from "./pages/SavedRecipesPage.jsx";
import { getToken, removeToken } from "./services/api.js";
import { getRecipeKey } from "./utils/recipeVisuals.js";

const navTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1]
};

const navIconTransition = {
  type: "spring",
  duration: 0.28,
  bounce: 0.18
};

const navIndicatorTransition = {
  type: "spring",
  duration: 0.28,
  bounce: 0.12
};

function App() {
  const [page, setPage] = useState(getToken() ? "ingredients" : "login");
  const [selectedSavedRecipeId, setSelectedSavedRecipeId] = useState(null);
  const [selectedGeneratedRecipe, setSelectedGeneratedRecipe] = useState(null);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [savedGeneratedRecipeIds, setSavedGeneratedRecipeIds] = useState(new Map());

  function handleLogout() {
    removeToken();
    setSelectedSavedRecipeId(null);
    setSelectedGeneratedRecipe(null);
    setGeneratedRecipes([]);
    setSavedGeneratedRecipeIds(new Map());
    setPage("login");
  }

  function viewSavedRecipe(id) {
    setSelectedSavedRecipeId(id);
    setSelectedGeneratedRecipe(null);
    setPage("recipeDetail");
  }

  function viewGeneratedRecipe(recipe) {
    setSelectedSavedRecipeId(null);
    setSelectedGeneratedRecipe(recipe);
    setPage("recipeDetail");
  }

  function handleSavedRecipeDeleted(savedRecipe) {
    const recipeKey = getRecipeKey(savedRecipe.recipe);

    setSavedGeneratedRecipeIds((currentIds) => {
      if (currentIds.get(recipeKey) !== savedRecipe.id) {
        return currentIds;
      }

      const nextIds = new Map(currentIds);
      nextIds.delete(recipeKey);
      return nextIds;
    });
  }

  function renderWithNavigation(content) {
    return (
      <div className="app-shell">
        <div className="phone-container">
          {content}
          <LayoutGroup id="bottom-navigation">
          <motion.nav
            className="bottom-nav"
            aria-label="Main navigation"
            layoutRoot
          >
            <motion.button
              type="button"
              className={page === "ingredients" ? "active" : ""}
              onClick={() => setPage("ingredients")}
              whileTap={{ scale: 0.94 }}
            >
              {page === "ingredients" && (
                <motion.span
                  className="bottom-nav-indicator"
                  layoutId="bottom-nav-indicator"
                  transition={navIndicatorTransition}
                />
              )}
              <motion.span
                className="bottom-nav-content"
                animate={{
                  color: page === "ingredients" ? "#ffffff" : "#738076",
                  opacity: page === "ingredients" ? 1 : 0.82
                }}
                transition={navTransition}
              >
                <motion.span
                  className="bottom-nav-icon"
                  animate={{ scale: page === "ingredients" ? 1.07 : 1 }}
                  transition={navIconTransition}
                >
                  <Package size={19} strokeWidth={2} aria-hidden="true" />
                </motion.span>
                <motion.span className="bottom-nav-label">
                  Ingredients
                </motion.span>
              </motion.span>
            </motion.button>
            <motion.button
              type="button"
              className={page === "recipes" ? "active" : ""}
              onClick={() => setPage("recipes")}
              whileTap={{ scale: 0.94 }}
            >
              {page === "recipes" && (
                <motion.span
                  className="bottom-nav-indicator"
                  layoutId="bottom-nav-indicator"
                  transition={navIndicatorTransition}
                />
              )}
              <motion.span
                className="bottom-nav-content"
                animate={{
                  color: page === "recipes" ? "#ffffff" : "#738076",
                  opacity: page === "recipes" ? 1 : 0.82
                }}
                transition={navTransition}
              >
                <motion.span
                  className="bottom-nav-icon"
                  animate={{ scale: page === "recipes" ? 1.07 : 1 }}
                  transition={navIconTransition}
                >
                  <ChefHat size={19} strokeWidth={2} aria-hidden="true" />
                </motion.span>
                <motion.span className="bottom-nav-label">
                  Generate
                </motion.span>
              </motion.span>
            </motion.button>
            <motion.button
              type="button"
              className={page === "savedRecipes" || page === "recipeDetail" ? "active" : ""}
              onClick={() => setPage("savedRecipes")}
              whileTap={{ scale: 0.94 }}
            >
              {(page === "savedRecipes" || page === "recipeDetail") && (
                <motion.span
                  className="bottom-nav-indicator"
                  layoutId="bottom-nav-indicator"
                  transition={navIndicatorTransition}
                />
              )}
              <motion.span
                className="bottom-nav-content"
                animate={{
                  color:
                    page === "savedRecipes" || page === "recipeDetail"
                      ? "#ffffff"
                      : "#738076",
                  opacity:
                    page === "savedRecipes" || page === "recipeDetail"
                      ? 1
                      : 0.82
                }}
                transition={navTransition}
              >
                <motion.span
                  className="bottom-nav-icon"
                  animate={{
                    scale:
                      page === "savedRecipes" || page === "recipeDetail"
                        ? 1.07
                        : 1
                  }}
                  transition={navIconTransition}
                >
                  <Bookmark size={19} strokeWidth={2} aria-hidden="true" />
                </motion.span>
                <motion.span className="bottom-nav-label">Saved</motion.span>
              </motion.span>
            </motion.button>
            <motion.button type="button" onClick={handleLogout} whileTap={{ scale: 0.94 }}>
              <motion.span
                className="bottom-nav-content"
                animate={{ color: "#738076", opacity: 0.82 }}
                transition={navTransition}
              >
                <motion.span
                  className="bottom-nav-icon"
                  animate={{ scale: 1 }}
                  transition={navIconTransition}
                >
                  <LogOut size={19} strokeWidth={2} aria-hidden="true" />
                </motion.span>
                <motion.span className="bottom-nav-label">Logout</motion.span>
              </motion.span>
            </motion.button>
          </motion.nav>
          </LayoutGroup>
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
        generatedRecipes={generatedRecipes}
        setGeneratedRecipes={setGeneratedRecipes}
        savedRecipeIds={savedGeneratedRecipeIds}
        setSavedRecipeIds={setSavedGeneratedRecipeIds}
        onViewRecipe={viewGeneratedRecipe}
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
        onRecipeDeleted={handleSavedRecipeDeleted}
      />
    );
  }

  if (page === "recipeDetail") {
    return renderWithNavigation(
      <RecipeDetailPage
        savedRecipeId={selectedSavedRecipeId}
        recipe={selectedGeneratedRecipe}
        onBack={() => setPage(selectedGeneratedRecipe ? "recipes" : "savedRecipes")}
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
