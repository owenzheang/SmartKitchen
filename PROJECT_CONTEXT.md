# ChefSpark Project Context

## Product

ChefSpark is a mobile-first AI cooking assistant for people who have ingredients but are unsure what to cook. It began as the SmartKitchen university MVP and is now being developed as a real product intended for public use.

The product should provide a useful cooking workflow rather than behave like a generic recipe chatbot. Its core advantages are persistent ingredient inventory, structured recipe generation, visual recipe cards, saved recipes, and an installable mobile-first experience.

## Current Users

- Students and people living alone
- Busy workers
- Beginner cooks
- People who want to use ingredients they already have

## Current Product Flow

```text
Register or log in
-> Manage personal ingredients
-> Choose cuisine and difficulty
-> Generate three AI recipes
-> Review match scores and missing ingredients
-> Open recipe details
-> Save and revisit recipes
```

## Current Capabilities

- JWT-based registration, login, logout, and protected user data
- Ingredient create, read, update, and delete operations backed by SQLite
- Chinese or Western cuisine selection and Easy, Medium, or Hard difficulty
- DeepSeek generation of three structured recipes
- Match scores, missing ingredients, cooking time, and cooking steps
- Pexels recipe images with caching and a placeholder fallback
- Saved recipe list, detail view, and deletion
- Responsive mobile-first UI with animated bottom navigation
- Installable PWA tested on Android and iPhone
- Frontend deployment on Vercel and backend deployment on Render

## Architecture

- Frontend: React, Vite, CSS, Motion, Lucide React, and `vite-plugin-pwa`
- Backend: Node.js and Express.js
- Database: SQLite
- Authentication: JWT and bcrypt
- AI: DeepSeek API using `deepseek-chat`
- Images: Pexels API
- Deployment: Vercel frontend and Render backend

The existing architecture should be preserved unless a change is explicitly discussed and approved. Prefer focused, incremental improvements over broad rewrites.

## Product Principles

- Mobile first
- Simple, fast, and polished
- Structured workflows over open-ended chat
- Clear value beyond what a user could get from a generic AI chatbot
- Reliable fallbacks when external AI or image services fail
- Maintainable implementation without unnecessary frameworks or infrastructure

## Current Limitations

- Navigation is state-based rather than URL-routed.
- JWT tokens are stored in browser `localStorage`.
- Saved recipe duplicates are allowed.
- Recipe generation depends on DeepSeek availability and output quality.
- Cuisine choices are currently limited to Chinese and Western.
- Nutrition, meal planning, shopping lists, and food recognition are not implemented.
- There are no automated tests yet.

## Documentation Sources

- `README.md` contains the product overview and local setup instructions.
- `RULES.md` defines development constraints and the approved stack.
- `PROJECT_HANDOVER.md` contains detailed history, completed work, lessons, and future direction.
- The SmartKitchen workflow and technical design documents describe the original MVP and are historical references, not current specifications.
