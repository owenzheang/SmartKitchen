const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL?.trim() ||
    (import.meta.env.DEV ? "http://localhost:5000/api" : ""))
    .replace(/\/+$/, "");
const TOKEN_KEY = "smartkitchen_token";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      "ChefSpark API is not configured. Set VITE_API_BASE_URL to the backend /api URL."
    );
  }

  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error(
      "Unable to reach the ChefSpark server. Check that the backend is running and the API URL is correct."
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}.`);
  }

  return data ?? {};
}

export function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function registerUser(email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function getIngredients() {
  return request("/ingredients");
}

export function addIngredient(ingredient) {
  return request("/ingredients", {
    method: "POST",
    body: JSON.stringify(ingredient)
  });
}

export function updateIngredient(id, ingredient) {
  return request(`/ingredients/${id}`, {
    method: "PUT",
    body: JSON.stringify(ingredient)
  });
}

export function deleteIngredient(id) {
  return request(`/ingredients/${id}`, {
    method: "DELETE"
  });
}

export function generateRecipes(options) {
  return request("/recipes/generate", {
    method: "POST",
    body: JSON.stringify(options)
  });
}

export function saveRecipe(recipe) {
  return request("/saved-recipes", {
    method: "POST",
    body: JSON.stringify({ recipe })
  });
}

export function getSavedRecipes() {
  return request("/saved-recipes");
}

export function getSavedRecipe(id) {
  return request(`/saved-recipes/${id}`);
}

export function deleteSavedRecipe(id) {
  return request(`/saved-recipes/${id}`, {
    method: "DELETE"
  });
}
