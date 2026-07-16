# ChefSpark Project Handover

Version: July 2026

## Product Overview

ChefSpark is a mobile-first AI cooking assistant that helps users decide what to cook with ingredients they already have. It began as the SmartKitchen university MVP and is now intended to become a real product.

The product direction is a structured mobile cooking workflow, not an open-ended recipe chatbot:

```text
Manage ingredients
-> Select cuisine and difficulty
-> Generate three recipe summaries
-> Open full cooking details
-> Save and revisit recipes
```

## Current Architecture

- Frontend: React, Vite, CSS, Motion, Lucide React, and `vite-plugin-pwa`
- Backend: Node.js and Express.js
- Database: SQLite
- Authentication: JWT and bcrypt
- AI: DeepSeek `deepseek-chat` with JSON output
- Images: local cuisine placeholders by default; optional Pexels integration
- Deployment: Vercel frontend and Render backend

Preserve this architecture unless a future change is explicitly discussed and approved.

## Current Status

### Authentication

- Registration, login, logout, and protected routes are implemented.
- JWT is stored in browser `localStorage`.
- Logout clears generated recipes and current-session bookmark state.

### Ingredients

- Ingredient CRUD is backed by SQLite and scoped to the authenticated user.
- The initial ingredient list is fetched when the Ingredients page loads.
- Add uses an immediate temporary local item, then replaces it with the server-returned SQLite record.
- Delete removes the item immediately.
- Failed adds roll back; failed deletes restore the item at its previous position.
- Per-name and per-ID pending guards prevent duplicate rapid actions.
- Successful add and delete operations no longer refetch the complete ingredient list.

### Recipe Generation and AI Quality

- The backend reads the authenticated user's stored ingredients.
- Ingredient names are trimmed and empty values are removed.
- An empty ingredient list returns HTTP 400 before DeepSeek is called.
- A small exact-match dangerous-item blocklist stops clearly unsafe input before the AI call.
- The DeepSeek prompt silently ignores unsafe, non-food, vague, fictional, joke, or irrelevant items.
- Condiment-only or otherwise unusable input is returned by DeepSeek as a structured usability error and becomes a helpful HTTP 400 response.
- The prompt requires exactly three meaningfully different recipes, allows different ingredient subsets, and discourages variations of the same dish.
- Post-AI validation checks recipe count, fields, arrays, match-score range, step count, non-empty steps, and dangerous content.
- Invalid JSON or unsafe/incomplete output returns a clear generation error.
- The successful response remains `{ recipes: [...] }`, with the existing recipe fields and `imageUrl`.

AI usability classification is intentionally prompt-assisted rather than based on a very large hardcoded food/non-food taxonomy. The small pre-call blocklist handles only obvious danger; DeepSeek still carries part of the quality and diversity responsibility.

### Cuisine Options

The frontend currently displays:

- Chinese
- Japanese
- Western
- Thai

Korean and Indian remain accepted by backend validation but are not currently visible choices.

### Generated Recipe Workflow

- Generate results are modern summary cards and do not render full ingredient lists or cooking steps.
- Each card shows cuisine artwork, title, match score, difficulty, a clock beside cooking time, and ingredient availability.
- No missing ingredients produces a green confirmation card.
- Missing ingredients produce a warm warning card with ingredient chips.
- The bookmark is the save/unsave control and fills after a successful save.
- View Recipe is the main card action.
- Full ingredients and steps remain on Recipe Detail.
- Generated recipes live in `App.jsx` state, so they survive bottom-navigation changes during the current session.
- They clear on logout and disappear after browser refresh because they are not stored in SQLite.

The current generated card radius is 22px. The implemented brand green is based on `#45A349`, with related hover, pressed, light, soft, and border tokens.

### Saved Recipes

- Generated recipes can be saved to SQLite, opened from Saved Recipes, and deleted.
- The Generate bookmark performs a real delete request when unsaving; it is not a visual-only toggle.
- A saved recipe ID is tracked by recipe identity during the current session.
- Deleting a matching recipe from Saved Recipes removes its Generate bookmark state through `App.jsx` synchronization.
- This synchronization applies to recipes tracked in the current app session; the bookmark map is not rebuilt after browser refresh.
- Duplicate saved recipes remain possible across sessions.

### Image Provider Decision

Pexels was paused as the default because a visually incorrect stock image can reduce trust more than a consistent branded placeholder, and external searches add latency and network dependency.

`IMAGE_PROVIDER` controls backend behavior:

- `placeholder` is the default and skips Pexels requests.
- `pexels` reactivates the existing Pexels service and requires `PEXELS_API_KEY`.

The frontend currently uses final local cuisine assets for Chinese, Japanese, Western, and Thai through one shared component across Generate, Recipe Detail, and Saved Recipes. Unknown cuisines fall back to Chinese artwork. AI-generated recipe images are a future direction and are not implemented.

### Mobile and PWA

- The UI is responsive and mobile-first.
- Floating bottom navigation, safe-area handling, PWA manifest, service worker, and install assets are implemented.
- The PWA precaches static assets only. Authenticated data and AI workflows remain online operations.

## Key Technical Decisions

- Keep generated recipes in parent React state for session navigation persistence without changing the database schema.
- Keep saved recipes in SQLite and use real saved-row IDs for true bookmark unsave.
- Centralize cuisine artwork in one reusable helper/component rather than duplicating page logic.
- Default to deterministic local placeholders while retaining optional Pexels code for later evaluation.
- Use layered AI protection: small pre-call checks, explicit prompt rules, and strict post-response validation.
- Use optimistic ingredient mutations because perceived responsiveness should not wait for normal network latency.

## Security Incident and Current Secret Hygiene

A real DeepSeek API key was historically committed in `server/.env`. Deleting that file in a later commit removed it from the current tracked tree but did not remove the credential from Git history. The exposed key was revoked and replaced; no key value or fingerprint should ever be copied into documentation, tickets, logs, or messages.

Current `.env` files are untracked and ignored, while only example environment files are tracked. Git-history cleanup may still be considered as a separate, carefully planned operation. Even if history is rewritten, revocation and rotation remain mandatory because existing clones and caches may retain the old secret.

Where possible, use separate API keys for local development, production, and experimental tools so usage and compromise can be isolated.

## Known Unresolved Issues

- State-based navigation prevents stable deep links and browser URL routing.
- JWT remains in `localStorage`.
- Generated recipes are lost on browser refresh.
- Current-session bookmark synchronization is not reconstructed from saved data after refresh.
- Saved-recipe duplicates are not prevented server-side.
- SQLite writes to a relative local file; durable Render persistence and account retention need explicit validation or a persistent storage strategy.
- Render cold starts may delay authentication and API requests.
- There are no automated tests.
- Rate limiting, request quotas, and dedicated DeepSeek cost protection are not implemented.
- AI usability and diversity still depend partly on DeepSeek behavior.
- Cuisine placeholders do not depict each exact generated recipe.
- Food recognition and other planned workflow features are not implemented.

## Recommended Next Priorities

1. Validate production data retention and choose a durable database/storage approach before broader public use.
2. Add rate limiting, usage monitoring, and practical AI cost safeguards.
3. Measure and reduce Render cold-start and request latency.
4. Add focused automated tests for authentication, ingredient rollback, AI validation, and saved-recipe synchronization.
5. Test the current workflow with real users on installed mobile PWAs.
6. Decide whether bookmark state should be rebuilt from saved recipes after refresh and whether server-side duplicate prevention is required.
7. Begin Food Recognition only after the core production risks are controlled.

## Historical Context

The original SmartKitchen MVP established authentication, ingredient management, Chinese/Western cuisine selection, AI recipe generation, recipe detail, and saved recipes. The historical `SMARTKITCHEN_Workflow_v1.md` and `SMARTKITCHEN_Technical_Design_v1.md` remain useful records of that initial scope but are not current product requirements.

ChefSpark's long-term differentiator remains workflow quality: persistent inventory, fast ingredient capture, structured decisions, and guided cooking. Every major feature should answer why the user would choose ChefSpark instead of asking a generic chatbot.
