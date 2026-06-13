const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

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
      "steps": ["string"]
    }
  ]
}

Rules:
- Return exactly 3 recipes.
- Return JSON only.
- Return 4-8 cooking steps per recipe.
- Prefer using the user's available ingredients.
- Each matchScore must be an integer between 0 and 100.
- The difficulty for each recipe should be ${difficulty} unless a recipe truly cannot match it.
- Recipes must be suitable for beginner cooks.
- missingIngredients should list only ingredients the user does not already have.
- steps should be clear and simple.`,
    user: `Available ingredients:
${ingredientList}

Preferred cuisine:
${cuisine}

Preferred difficulty:
${difficulty}

Generate 3 beginner-friendly recipes using these ingredients.
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
    typeof recipe.cuisine === "string" &&
    typeof recipe.difficulty === "string" &&
    typeof recipe.cookTime === "string" &&
    Number.isInteger(recipe.matchScore) &&
    recipe.matchScore >= 0 &&
    recipe.matchScore <= 100 &&
    isStringArray(recipe.missingIngredients) &&
    isStringArray(recipe.ingredients) &&
    isStringArray(recipe.steps) &&
    recipe.steps.length >= 4 &&
    recipe.steps.length <= 8
  );
}

function validateRecipeResponse(data) {
  if (!data || !Array.isArray(data.recipes)) {
    return false;
  }

  if (data.recipes.length !== 3) {
    return false;
  }

  return data.recipes.every(isValidRecipe);
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
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  if (!validateRecipeResponse(parsedContent)) {
    throw new Error("AI response format was invalid. Please try again.");
  }

  return parsedContent;
}
