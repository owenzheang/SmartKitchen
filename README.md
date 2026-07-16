# ChefSpark

ChefSpark is a mobile-first AI cooking assistant that helps users turn ingredients they already have into practical recipe ideas. It combines persistent ingredient inventory, guided cuisine and difficulty selection, concise recipe results, full cooking instructions, and saved recipes in an installable PWA.

## Current Features

- User registration, login, and logout
- bcrypt password hashing and JWT-protected user data
- SQLite-backed ingredient management with optimistic add and delete interactions
- Chinese, Japanese, Western, and Thai cuisine selection
- Easy, Medium, and Hard difficulty selection
- DeepSeek `deepseek-chat` generation of exactly three structured recipes
- Basic pre-AI ingredient safety checks, AI usability rules, and post-response validation
- Recipe summary cards with match score, cooking time, difficulty, and missing-ingredient status
- Full ingredients and cooking steps on Recipe Detail
- Bookmark save/unsave control and SQLite-backed Saved Recipes
- Branded cuisine placeholder artwork on Generate, Recipe Detail, and Saved Recipes
- Mobile-first floating navigation and installable PWA

Generated results remain available while navigating during the current app session. They are cleared on logout and are not retained after a browser refresh.

## Tech Stack

### Frontend

- React
- Vite
- CSS
- Motion
- Lucide React
- `vite-plugin-pwa`

### Backend

- Node.js
- Express.js
- JWT
- bcrypt
- CORS
- dotenv

### Data and Services

- SQLite
- DeepSeek API using `deepseek-chat`
- Local cuisine placeholder assets by default
- Optional Pexels recipe-image lookup

## Local Setup

### Prerequisites

- Node.js 18 or newer
- npm
- A DeepSeek API key
- A Pexels API key only when using Pexels image mode

### 1. Clone the repository

```bash
git clone <repository-url>
cd ChefSpark
```

### 2. Install and configure the backend

```bash
cd server
npm install
```

Create `server/.env` from `server/.env.example`:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
JWT_SECRET=your_secure_jwt_secret
IMAGE_PROVIDER=placeholder
PEXELS_API_KEY=your_pexels_api_key_if_needed
```

`IMAGE_PROVIDER` supports:

- `placeholder` — default; skips Pexels requests and uses local cuisine artwork
- `pexels` — enables the existing Pexels lookup and requires `PEXELS_API_KEY`

Start the backend:

```bash
npm run dev
```

The backend uses `http://localhost:5000` by default.

### 3. Install and run the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. In local Vite development, the frontend defaults to `http://localhost:5000/api` when `VITE_API_BASE_URL` is not supplied.

## Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | Yes | Authenticates recipe-generation requests to DeepSeek. |
| `JWT_SECRET` | Yes | Signs and verifies authentication tokens. |
| `IMAGE_PROVIDER` | Recommended | `placeholder` by default, or `pexels` to enable Pexels lookup. |
| `PEXELS_API_KEY` | Pexels mode only | Authenticates Pexels requests when `IMAGE_PROVIDER=pexels`. |
| `CORS_ORIGINS` | Production | Comma-separated frontend origins allowed to call the backend. |
| `PORT` | Hosting-dependent | Overrides the backend's default port of `5000`. |

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Production | Backend API base URL including `/api`, for example `https://your-backend.example/api`. |

Trailing slashes are removed from the frontend API base URL. Backend CORS accepts local Vite development from `localhost`, `127.0.0.1`, and supported local-network origins outside production, plus origins listed in `CORS_ORIGINS`.

Never commit real API keys, JWT secrets, or `.env` files. If a secret is ever committed, removing the file in a later commit is not enough: revoke and rotate the secret, then assess Git-history cleanup separately.

## Deployment

The current deployment arrangement is:

- Frontend: Vercel
- Backend: Render
- Database: SQLite file created relative to the backend working directory

Set `VITE_API_BASE_URL` on Vercel to the Render backend URL including `/api`, set the required backend variables on Render, and include the Vercel origin in `CORS_ORIGINS`.

The current repository does not establish a durable production database strategy. Before treating the service as production-ready, verify Render disk persistence, account and saved-data retention across deploys/restarts, cold-start latency, rate limiting, and AI cost controls.

## PWA Setup

ChefSpark is configured as an installable PWA with `vite-plugin-pwa`. Static application assets, including cuisine placeholders, are precached. Authentication, ingredient changes, recipe generation, and saved-recipe requests still require the backend and a network connection.

Build and preview:

```bash
cd client
npm run build
npm run preview
```

On Android, use Chrome's Install app or Add to Home screen action. On iPhone, open the app in Safari and choose Share -> Add to Home Screen.

## Current Limitations

- State-based navigation instead of URL routing
- JWT token stored in browser `localStorage`
- Generated recipes are lost on browser refresh
- Saved-recipe duplicates can occur across sessions
- SQLite production persistence on Render requires further validation
- Possible Render cold-start latency
- Recipe safety and diversity still depend partly on DeepSeek
- Cuisine placeholders are not exact images of each generated dish
- No automated tests, rate limiting, or dedicated AI cost controls
- No food recognition, nutrition, meal planning, shopping list, or voice cooking mode yet

## Product Direction

ChefSpark began as the SmartKitchen university MVP and is now being developed as a real mobile cooking workflow. Food recognition remains the next major differentiating product feature: photograph ingredients, review detected items, add them to inventory, and generate recipes through the existing structured flow.
