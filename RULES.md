# ChefSpark Development Rules

## General Rules

1. Keep the project approachable and maintainable.
2. Prefer simple, readable solutions over unnecessary complexity.
3. Follow the existing project structure and conventions.
4. Implement one focused feature or fix at a time.
5. Do not modify unrelated files.
6. Explain major architectural decisions before implementation.
7. Ask before making a major architecture or technology change.

## Approved Stack

### Frontend

- React
- Vite
- CSS
- Motion (Framer Motion)
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
- DeepSeek API using the `deepseek-chat` model and JSON responses
- Pexels API for recipe images

### Deployment

- Vercel for the frontend
- Render for the backend
- Progressive Web App for mobile installation

Do not introduce Next.js, Prisma, PostgreSQL, Docker, Redis, GraphQL, microservices, or Kubernetes unless explicitly approved.

## Development Rules

1. Keep API endpoints RESTful.
2. Reuse components when it improves clarity without over-engineering.
3. Use clear file, component, function, and route names.
4. Use comments only when they clarify non-obvious intent.
5. Preserve mobile-first behavior and safe-area support.
6. Preserve authentication and user data boundaries.
7. Keep secrets on the backend and out of source control.
8. Validate AI responses before returning or storing them.
9. Maintain graceful fallbacks for external services where practical.
10. Test changes in proportion to their risk, including a production build for frontend changes when appropriate.

## Environment Variables

Backend:

- `DEEPSEEK_API_KEY`
- `PEXELS_API_KEY`
- `JWT_SECRET`
- `CORS_ORIGINS` for production origin configuration
- `PORT` when supplied by the hosting environment

Frontend:

- `VITE_API_BASE_URL` for the deployed backend API

Never place real credentials in documentation, committed `.env` files, client code, or logs.

## Change Reporting

When making changes:

1. State which files were created or modified.
2. Explain why each change was needed.
3. Explain how the result works in clear language.
4. Report the verification performed and any remaining limitations.
