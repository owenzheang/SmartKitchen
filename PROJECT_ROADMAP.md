# ChefSpark Product Roadmap

Version: July 2026

## Vision

ChefSpark aims to become a practical mobile cooking companion rather than a generic recipe chatbot. It should help users move quickly from available ingredients to a confident cooking decision through a structured, persistent workflow.

## Current Stage

ChefSpark is in public-beta stabilization as an installable PWA:

- Frontend deployment: Vercel
- Backend deployment: Render
- Current database: SQLite
- Mobile testing: Android and iPhone

The core flow works, but durable production data, cold-start performance, automated testing, and cost protection still require attention before production readiness can be claimed.

## Recently Completed

### Core Workflow

- Registration, login, logout, and authenticated user data
- SQLite-backed ingredient CRUD
- Chinese, Japanese, Western, and Thai frontend cuisine choices
- Easy, Medium, and Hard difficulty choices
- DeepSeek generation of three recipes
- Recipe summary cards and full Recipe Detail views
- SQLite-backed saved recipes

### AI Safety and Recipe Quality

- Ingredient trimming and empty-value removal
- HTTP 400 response for empty ingredient lists
- Small dangerous-item blocklist before DeepSeek
- Prompt rules for unusable, non-food, unsafe, fictional, joke, and vague input
- Helpful rejection of condiment-only or otherwise unusable input
- Exactly three meaningfully different recipes using useful ingredient subsets
- Post-AI structure, completeness, score, step-count, and dangerous-content validation

### Mobile UX and Performance

- Generated results persist during in-app navigation and clear on logout
- Generate results show summaries only; full steps remain on Recipe Detail
- 22px generated recipe cards with clock metadata, ingredient-status panels, bookmark control, and View Recipe action
- True Generate-page bookmark save/unsave using real SQLite row IDs
- Saved-page deletion synchronizes matching current-session Generate bookmark state
- Optimistic ingredient add and delete with rollback and duplicate-action guards
- Successful ingredient mutations no longer refetch the full list
- Floating bottom navigation, safe-area support, and PWA installation

### Image Strategy

- Placeholder mode is the default image-provider mode
- Pexels requests are skipped in placeholder mode
- Shared final cuisine artwork is used across Generate, Recipe Detail, and Saved Recipes
- Optional Pexels integration remains available through `IMAGE_PROVIDER=pexels`

### Security Hygiene

- Historically exposed DeepSeek credential revoked and replaced
- Real `.env` files removed from tracking and ignored
- Secret-history exposure documented as a critical engineering lesson

## Current Stabilization Priorities

1. Add focused automated tests for authentication, optimistic rollback, recipe-response validation, and save/unsave synchronization.
2. Decide whether Generate bookmark state should be rebuilt from saved recipes after refresh.
3. Define saved-recipe duplicate behavior and add server-side protection if duplicates are not desired.
4. Improve AI usability and diversity evaluation with repeatable test cases.
5. Run real-user testing on installed Android and iPhone PWAs.
6. Review whether Git-history cleanup is needed as a separate security operation.

## Production Readiness

### Durable Data

- Verify SQLite retention across Render restarts and deploys.
- Establish a persistent disk or approved future database strategy before depending on long-term account, ingredient, and saved-recipe retention.
- Test backup and recovery expectations.

### Reliability and Performance

- Measure Render cold starts and authentication/API latency.
- Add health monitoring and clearer operational diagnostics.
- Add appropriate request timeouts and retry policies without causing duplicate AI calls.

### AI Cost and Abuse Protection

- Add server-side rate limiting.
- Add per-user or per-period generation limits if appropriate.
- Monitor DeepSeek usage and unexpected model/key activity.
- Use separate local, production, and experimental API keys.

### Security

- Remove the fallback JWT secret before production use and require `JWT_SECRET` configuration.
- Review `localStorage` token handling as the product's security requirements mature.
- Keep real secrets out of Git and rotate immediately after any exposure.

## Next Major Product Feature

### Food Recognition

Food Recognition remains ChefSpark's next major differentiating feature.

```text
Take a photo
-> Detect ingredients
-> Review and correct detections
-> Add approved items to inventory
-> Generate recipes through the existing workflow
```

This feature should reuse the current ingredient inventory and generation flow rather than creating a separate chatbot experience. It should begin after the production-readiness risks above are sufficiently controlled.

## Longer-Term Features

- Shopping list generated from missing ingredients
- Weekly meal planning
- Nutrition and calorie information
- Recipe search and filtering
- Duplicate detection and recipe collections
- Voice-guided cooking mode
- Expiry-date and food-waste reminders
- Recipe sharing
- Accurate generated or licensed recipe imagery, if quality and cost justify it

## Product Principle

Every proposed feature should answer:

> Why would a user choose ChefSpark instead of simply asking a generic AI chatbot?

Prioritize features that improve ingredient capture, persistence, decision speed, cooking confidence, or repeat use.
