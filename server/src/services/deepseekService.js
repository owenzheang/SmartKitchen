const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";
const INSUFFICIENT_INGREDIENTS_ERROR = "INSUFFICIENT_USABLE_INGREDIENTS";
const INSUFFICIENT_INGREDIENTS_MESSAGE =
  "Please add at least one main ingredient, such as eggs, rice, chicken, tofu, potato, tomato, or noodles.";

export const dangerousIngredientNames = new Set([
  "bleach",
  "detergent",
  "poison",
  "rat poison",
  "medicine",
  "battery",
  "paint",
  "cleaning spray",
  "pesticide",
  "gasoline",
  "alcohol fuel"
]);

function buildRecipePrompt(ingredients, cuisine, difficulty) {
  const ingredientList = ingredients
    .map((ingredient) => `- ${ingredient.name}${ingredient.quantity ? ` (${ingredient.quantity} ${ingredient.unit || ""})` : ""}`)
    .join("\n");

  return {
    system: `You are SMARTKITCHEN, a beginner-friendly cooking assistant.

Return JSON only. Do not include markdown, explanations, comments, or extra text.

The JSON must match this structure exactly:
{
  "recipes": [
    {
      "title": "string",
      "cuisine": "string",
      "difficulty": "Easy | Medium | Hard",
      "cookTime": "string",
      "matchScore": 0,
      "missingIngredients": ["string"],
      "ingredients": ["string"],
      "steps": ["string"],
      "imagePrompt": "string"
    }
  ]
}

If there are not enough usable food ingredients, return only:
{
  "error": "${INSUFFICIENT_INGREDIENTS_ERROR}"
}

Rules:
- Return exactly 3 recipes.
- Return JSON only.
- First analyze the available items and identify which are real, edible cooking ingredients.
- Silently ignore non-edible, unrealistic, fictional, joke, vague, or irrelevant items.
- Never mention ignored items or include them in titles, ingredients, missingIngredients, imagePrompt, or steps.
- Never generate recipes using unsafe, toxic, non-food, fictional, or joke ingredients.
- If the usable items are only condiments, seasonings, sauces, liquids, or supporting ingredients, return the error JSON.
- If there is not enough usable food to make a real home-cooked dish, return the error JSON.
- Do not invent a dish just to satisfy the request.
- Return 4-8 cooking steps per recipe.
- Prefer using the user's available ingredients.
- The 3 recipes must be meaningfully different dishes, not small variations of the same dish.
- Do not force every available ingredient into every recipe; each recipe may use a useful subset.
- Prefer different cooking methods or formats when suitable, such as stir-fry, soup, rice bowl, steamed dish, pan-fried dish, stew, salad, or noodle-style dish.
- Each matchScore must be an integer between 0 and 100.
- The difficulty for each recipe should be ${difficulty} unless a recipe truly cannot match it.
- Recipes must be suitable for beginner cooks.
- missingIngredients should list only ingredients the user does not already have.
- steps should be clear and simple.
- imagePrompt should be a short food photo search phrase for Pexels.
- imagePrompt should include the recipe title, cuisine, and words like plated food.`,
    user: `Available ingredients:
${ingredientList}

Preferred cuisine:
${cuisine}

Preferred difficulty:
${difficulty}

Generate 3 realistic, meaningfully different beginner-friendly recipes using the usable edible ingredients.
Return JSON only.`
  };
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isValidRecipe(recipe) {
  return (
    recipe &&
    typeof recipe.title === "string" &&
    recipe.title.trim().length > 0 &&
    typeof recipe.cuisine === "string" &&
    recipe.cuisine.trim().length > 0 &&
    typeof recipe.difficulty === "string" &&
    recipe.difficulty.trim().length > 0 &&
    typeof recipe.cookTime === "string" &&
    recipe.cookTime.trim().length > 0 &&
    Number.isInteger(recipe.matchScore) &&
    recipe.matchScore >= 0 &&
    recipe.matchScore <= 100 &&
    isStringArray(recipe.missingIngredients) &&
    isStringArray(recipe.ingredients) &&
    recipe.ingredients.length > 0 &&
    isStringArray(recipe.steps) &&
    typeof recipe.imagePrompt === "string" &&
    recipe.imagePrompt.trim().length > 0 &&
    recipe.steps.length >= 4 &&
    recipe.steps.length <= 8 &&
    recipe.steps.every((step) => step.trim().length > 0)
  );
}

function containsDangerousText(value) {
  if (typeof value === "string") {
    const normalizedValue = value.toLowerCase();
    return [...dangerousIngredientNames].some((item) => normalizedValue.includes(item));
  }

  if (Array.isArray(value)) {
    return value.some(containsDangerousText);
  }

  return false;
}

function recipeContainsDangerousContent(recipe) {
  return [
    recipe.title,
    recipe.ingredients,
    recipe.missingIngredients,
    recipe.imagePrompt,
    recipe.steps
  ].some(containsDangerousText);
}

function validateRecipeResponse(data) {
  if (!data || !Array.isArray(data.recipes)) {
    return false;
  }

  if (data.recipes.length !== 3) {
    return false;
  }

  return data.recipes.every(
    (recipe) => isValidRecipe(recipe) && !recipeContainsDangerousContent(recipe)
  );
}

function createGenerationError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function generateRecipesWithDeepSeek({ ingredients, cuisine, difficulty }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DeepSeek API key is missing.");
  }

  const prompt = buildRecipePrompt(ingredients, cuisine, difficulty);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek request failed: ${errorText}`);
  }

  const deepseekData = await response.json();
  const content = deepseekData.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek returned an empty response.");
  }

  let parsedContent;

  try {
    parsedContent = JSON.parse(content);
  } catch (error) {
    throw createGenerationError("AI returned invalid JSON. Please try again.", 502);
  }

  if (parsedContent?.error === INSUFFICIENT_INGREDIENTS_ERROR) {
    throw createGenerationError(INSUFFICIENT_INGREDIENTS_MESSAGE, 400);
  }

  if (!validateRecipeResponse(parsedContent)) {
    throw createGenerationError(
      "AI could not generate three safe, complete recipes. Please try again.",
      502
    );
  }

  return parsedContent;
}
