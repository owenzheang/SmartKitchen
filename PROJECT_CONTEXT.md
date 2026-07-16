# ChefSpark Project Context

## Product

ChefSpark is a mobile-first AI cooking assistant for people who have ingredients but are unsure what to cook. It began as the SmartKitchen university MVP and is now being developed as a real product.

ChefSpark is a structured cooking workflow rather than a generic chatbot. Its core value is persistent ingredient inventory, guided recipe generation, concise recipe cards, detailed cooking instructions, saved recipes, and an installable mobile experience.

## Current Product Flow

```text
Register or log in
-> Manage personal ingredients
-> Choose Chinese, Japanese, Western, or Thai cuisine
-> Choose Easy, Medium, or Hard difficulty
-> Generate three recipes
-> Review recipe summaries and ingredient availability
-> Open full ingredients and steps in Recipe Detail
-> Save, unsave, and revisit recipes
```

## Current Capabilities

- JWT-based registration, login, logout, and protected user data
- SQLite-backed ingredient create, read, update, and delete operations
- Optimistic ingredient add and delete interactions with rollback on request failure
- DeepSeek `deepseek-chat` generation of exactly three structured recipes
- Pre-AI empty-input and dangerous-item checks
- Prompt rules that ignore unusable items, reject condiment-only input, allow ingredient subsets, and require meaningfully different dishes
- Post-AI validation for complete, safe recipe output
- Summary-only Generate cards with match score, cooking time, difficulty, ingredient status, bookmark control, and View Recipe action
- Full ingredient lists and cooking steps on Recipe Detail
- Generated results preserved across in-app navigation for the current session and cleared on logout
- SQLite-backed saved recipe list, detail view, deletion, and Generate-page save/unsave toggle
- Shared cuisine placeholder artwork on Generate, Recipe Detail, and Saved Recipes
- Responsive mobile-first UI, floating bottom navigation, and installable PWA
- Vercel frontend and Render backend deployment setup

## Architecture

- Frontend: React, Vite, CSS, Motion, Lucide React, and `vite-plugin-pwa`
- Backend: Node.js and Express.js
- Database: SQLite
- Authentication: JWT and bcrypt
- AI: DeepSeek API using `deepseek-chat` and JSON responses
- Images: branded cuisine placeholders by default; optional Pexels integration
- Deployment: Vercel frontend and Render backend

`IMAGE_PROVIDER` defaults to `placeholder`. In this mode the backend skips Pexels requests and returns an empty `imageUrl`; the frontend displays local Chinese, Japanese, Western, or Thai artwork. Setting `IMAGE_PROVIDER=pexels` re-enables the existing Pexels lookup and requires `PEXELS_API_KEY`. AI-generated recipe imagery is not implemented.

## AI Safety and Quality

Before DeepSeek is called, stored ingredient names are trimmed, empty names are removed, an empty usable list returns HTTP 400, and a small exact-match dangerous-item blocklist can stop generation.

DeepSeek is instructed to silently ignore non-food, unsafe, vague, fictional, or joke items; reject condiment-only or otherwise unusable input; generate exactly three meaningfully different recipes; and use useful ingredient subsets instead of forcing every item into every dish. The backend then validates the count, structure, required fields, cooking-step count, match-score range, and dangerous content. Invalid or incomplete AI output returns a clear generation error.

## Product Principles

- Mobile first
- Simple, fast, and polished
- Structured workflows over open-ended chat
- Clear value beyond a generic AI chatbot
- Safe validation and graceful external-service fallbacks
- Maintainable, incremental development within the existing architecture

## Current Limitations

- Navigation is state-based rather than URL-routed.
- JWT tokens are stored in browser `localStorage`.
- Generated recipes survive in-app navigation but disappear after browser refresh because they are not stored in SQLite.
- Saved-recipe duplicates remain possible across sessions.
- SQLite uses a local relative database file; durable production persistence and account retention on Render require further validation or a persistent storage strategy.
- Render cold starts can add backend latency and remain an operational concern.
- Ingredient usability and recipe diversity still depend partly on DeepSeek prompt compliance.
- Placeholder images represent cuisines rather than each exact generated dish.
- Automated tests, rate limiting, and dedicated AI cost controls are not implemented.
- Food recognition, nutrition, meal planning, shopping lists, and voice cooking are not implemented.

## Documentation Sources

- `README.md`: user-facing overview and setup
- `RULES.md`: development constraints and approved stack
- `PROJECT_HANDOVER.md`: detailed current status, decisions, and history
- `PROJECT_ROADMAP.md`: completed work and future priorities
- `LESSONS_LEARNED.md`: accumulated product and engineering lessons
- `SMARTKITCHEN_Workflow_v1.md` and `SMARTKITCHEN_Technical_Design_v1.md`: historical MVP references, not current requirements
