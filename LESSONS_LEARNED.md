# ChefSpark Lessons Learned

Version: July 2026

## Purpose

This document records the product, engineering, security, and delivery lessons that should guide future ChefSpark work.

## Product Lessons

### Build Workflows, Not AI Demos

Users care about deciding what to cook and completing a meal, not about the AI model itself. Persistent ingredients, structured choices, clear summaries, cooking details, and saved recipes create more value than an open-ended chatbot.

### Perceived Speed Is Product Quality

Optimistic ingredient add and delete interactions feel immediate even when persistence still requires a network request. The correct pattern is local update first, server request second, then reconciliation or rollback.

PWA interaction lag is often caused by state and network sequencing rather than by web technology itself. Measure when the UI changes relative to the request before blaming the platform or adding a new framework.

### Trustworthy Visuals Beat Incorrect Visuals

An attractive but unrelated stock photo can damage trust more than a consistent branded placeholder. External image searches also add latency, cost, and another failure mode. Placeholder-first is the safer default until image relevance can be guaranteed.

### Mobile Testing Is Essential

Safe areas, floating navigation, animation timing, tap feedback, and installed-PWA behavior must be tested on physical Android and iPhone devices. Desktop testing alone is not enough.

## AI Engineering Lessons

### Quality Requires Multiple Layers

AI recipe generation should use:

1. Backend validation before the AI call for clearly invalid or dangerous input.
2. Explicit prompt rules for usability, safety, diversity, and output structure.
3. Post-response validation before data reaches the UI or database.

No single layer is sufficient.

### Use Hardcoded Rules Selectively

A small blocklist is useful for obvious dangerous items because it avoids unnecessary billable calls. A huge hardcoded food/non-food taxonomy is difficult to maintain, incomplete across languages and cultures, and likely to create false positives. AI-assisted usability analysis is more maintainable for ambiguous, fictional, vague, and condiment-only inputs, provided its output is validated.

### Diversity Must Be Explicit

Without clear rules, a model may combine all available ingredients into several variations of the same obvious dish. Prompts should require meaningfully different cooking methods or formats and permit each recipe to use a useful subset of ingredients.

### External Calls Need Cost Protection

DeepSeek calls and optional image searches add latency and operational cost. Production work should include rate limiting, monitoring, separate credentials, and safeguards against automatic retry loops or duplicate requests.

## Security Lessons

### Deleting a Secret Does Not Remove It from Git History

A real DeepSeek key was historically committed in `server/.env`. Removing the file from the current tree did not erase earlier commits. A compromised credential must be revoked and rotated immediately; Git-history cleanup is a separate action and cannot replace rotation.

Never copy secret values or fingerprints into documentation, screenshots, logs, issues, or chat messages.

### Separate Credentials by Purpose

Where supported, use separate API keys for:

- local development
- production
- coding tools or experiments

Separation improves usage attribution, limits impact, and makes targeted rotation possible.

### Ignore Rules and Tracking State Are Different

Adding `.env` to `.gitignore` does not untrack a file that was already committed. Verify both ignore behavior and Git tracking state before publishing a repository.

## Engineering Lessons

### Incremental Changes Are Easier to Verify

Focused changes reduce regression risk and make it easier to preserve authentication, navigation, persistence, and mobile behavior. Reuse small shared helpers where the same behavior appears on multiple pages, but avoid architecture changes for local UI problems.

### Server Responses Can Avoid Wasteful Refetching

When a create endpoint returns the saved record, the client can reconcile optimistic state directly. When deletion succeeds, local removal is enough. Full-list refetching after every mutation increases latency and visual churn without adding value.

### Deployment Is Part of Development

Vercel, Render, CORS, environment variables, native SQLite dependencies, database persistence, and cold starts are product concerns. A successful build is not the same as durable production readiness.

### Test Failure Paths

Happy-path testing is insufficient for optimistic UI and external AI services. Verify offline adds, failed deletes, malformed AI JSON, unsafe output, insufficient ingredients, duplicate rapid taps, and navigation/logout state cleanup.

## Documentation Lessons

Documentation must be refreshed after major product or technical changes. Otherwise setup instructions, visible cuisine lists, image-provider behavior, limitations, and roadmap status quickly contradict the code.

Each document has a distinct role:

- `README.md` is user-facing and setup-focused.
- `PROJECT_CONTEXT.md` is concise current truth.
- `PROJECT_HANDOVER.md` records current status, decisions, history, and unresolved issues.
- `PROJECT_ROADMAP.md` separates completed work from stabilization and future priorities.
- Historical SmartKitchen files remain historical references rather than current requirements.

Before documenting a feature as complete, confirm it in live code and check the working-tree diff, not only the last Git commit.

## Future Principles

- Start simple and preserve the approved architecture.
- Validate before, during, and after AI generation.
- Make common interactions feel immediate and provide rollback.
- Prefer trustworthy fallbacks over misleading output.
- Keep secrets isolated, untracked, and rotated after exposure.
- Measure network, cold-start, and external-service latency.
- Test on real devices and with real users.
- Keep documentation synchronized with implementation.
- Build features that improve the cooking workflow beyond a generic chatbot.
