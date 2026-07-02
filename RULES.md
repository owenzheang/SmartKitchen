# RULES

# SMARTKITCHEN Development Rules

## General Rules

1. Keep the project beginner-friendly.
2. Prefer simple solutions over complex solutions.
3. Prioritize readability and maintainability.
4. Follow the existing project structure.
5. Explain major architectural decisions.

## Tech Stack Rules

Frontend:

- React
- Vite

Backend:

- Express.js

Database:

- SQLite

AI:

- DeepSeek API

AI Provider:
DeepSeek

Environment Variable:
DEEPSEEK_API_KEY: 
PEXELS_API_KEY: 

Model:
deepseek-chat

Response Format:
JSON

Error Handling:
Return HTTP 500 with error message

Do NOT introduce:

- Next.js
- Prisma
- PostgreSQL
- Docker
- Redis
- GraphQL
- Microservices
- Kubernetes

Unless explicitly requested.

## Development Rules

1. Implement one feature at a time.
2. Do not modify unrelated files.
3. Ask before making major architecture changes.
4. Use clear file and folder names.
5. Create reusable components when appropriate.
6. Keep API endpoints RESTful.
7. Use comments only when necessary.

## Output Rules

When generating code:

1. Explain what files were created.
2. Explain why they were created.
3. Explain how the feature works.
4. Use beginner-friendly explanations.