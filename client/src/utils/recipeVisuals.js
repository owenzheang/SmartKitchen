const cuisinePlaceholders = {
  chinese: "/cuisine-placeholders/chinese.png",
  japanese: "/cuisine-placeholders/japanese.png",
  western: "/cuisine-placeholders/western.png",
  thai: "/cuisine-placeholders/thai.png"
};

const fallbackCuisinePlaceholder = cuisinePlaceholders.chinese;

export function getRecipeKey(recipe = {}) {
  const title = typeof recipe.title === "string" ? recipe.title.trim() : "";
  const cookTime = typeof recipe.cookTime === "string" ? recipe.cookTime.trim() : "";

  return `${title}::${cookTime}`;
}

export function getCuisinePlaceholder(cuisine = "") {
  const normalizedCuisine = typeof cuisine === "string"
    ? cuisine.trim().toLowerCase()
    : "";

  return cuisinePlaceholders[normalizedCuisine] || fallbackCuisinePlaceholder;
}
