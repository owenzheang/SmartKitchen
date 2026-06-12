import { useState } from "react";
import IngredientsPage from "./pages/IngredientsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { getToken, removeToken } from "./services/api.js";

function App() {
  const [page, setPage] = useState(getToken() ? "ingredients" : "login");

  function handleLogout() {
    removeToken();
    setPage("login");
  }

  if (page === "register") {
    return (
      <RegisterPage
        onRegister={() => setPage("ingredients")}
        onShowLogin={() => setPage("login")}
      />
    );
  }

  if (page === "ingredients") {
    return <IngredientsPage onLogout={handleLogout} />;
  }

  return (
    <LoginPage
      onLogin={() => setPage("ingredients")}
      onShowRegister={() => setPage("register")}
    />
  );
}

export default App;
