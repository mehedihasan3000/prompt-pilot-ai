# PromptPilot AI — Agent Guide

## Dev commands

```bash
# Backend
cd backend && npm run dev          # tsx watch src/server.ts (port 4000)
npm run build                       # tsc -> dist/
npm start                           # node dist/server.js

# Frontend
cd frontend && npm run dev          # next dev (port 3000)
npm run build                       # next build
npm run lint                        # next lint
```

No test framework or test files exist. No typecheck script — use `npx tsc --noEmit` in each package.

## Architecture

**Monorepo** — two independent packages (no workspace manager):
- `backend/` — Express.js + native MongoDB driver (no Mongoose)
- `frontend/` — Next.js 16 App Router + TanStack Query v5

Backend entrypoint: `backend/src/server.ts` (connects DB, then starts Express).
Frontend API client: `frontend/src/lib/api.ts` — auto-prepends `/api` to all URLs.

## API response envelope

Every response: `{ success: boolean, data: T }`. Errors: `{ success: false, error: string }`.
Controllers unpack service results into `data`, never return raw service output.

## Auth (custom token, not proper Better Auth)

Backend middleware (`auth.middleware.ts`) reads `x-user-id` header as the user's MongoDB `_id` string — **no session validation yet** (`// TODO`).

Frontend stores token (`x-user-id` value) in `localStorage` under `auth_token`. The `apiFetch` helper attaches it automatically.

There is also a `frontend/src/lib/auth.ts` using Better Auth React client (`createAuthClient()`), but it is **not wired to the backend middleware**. Both auth paths coexist.

## MongoDB _id / id mapping

MongoDB native driver returns documents with `_id`. The frontend types all use `id`. Every service that returns data must map `_id` → `id`.

Shared utility at `backend/src/utils/mapDoc.ts`:
```ts
mapDoc<T>(doc)       // single doc: { _id, ...rest } -> { id, ...rest }
mapDocs<T>(docs)     // array of docs
```

Services already fixed: prompt, template, review, conversation, collection, auth.

**When adding a new service that queries MongoDB, always use `mapDoc`/`mapDocs` on returned documents.**

## AI agents

12 agent services under `backend/src/services/ai/` orchestrated by `orchestrator.ts`.

Providers:
- **Gemini 1.5 Flash** — analyzer, optimizer, variant generator, quality evaluator, recommender
- **Groq llama3-8b** — chat assistant (SSE streaming), auto tagger

Prompt templates in `backend/src/prompts/`. Rate limits: AI routes 10 req/min, general 100 req/min.

## CORS

Backend CORS origin = `env.BETTER_AUTH_URL` (default `http://localhost:3000`). Frontend must be on that origin.

## Env

Backend validates all env at startup via Zod (`backend/src/config/env.ts`). Missing vars crash on boot.
`backend/.env.example` lists all required vars.

## Routes

All backend routes under `/api/*`:
- `/api/prompts` — CRUD + toggle favorite
- `/api/templates` — CRUD + increment usage
- `/api/collections` — CRUD + add/remove prompts
- `/api/reviews` — CRUD per template
- `/api/conversations` — chat conversation CRUD + messages
- `/api/ai/*` — analyze, optimize, variants, score, recommend, chat (SSE), auto-tag
- `/api/analytics/*` — dashboard stats
- `/api/auth/*` — register, login, google, demo-login, logout, me
- `/api/users/*` — profile update, account delete

Frontend routes match directory structure under `frontend/src/app/` (15 pages: about, analytics, assistant, auth, blog, collections, contact, dashboard, explore, history, login, privacy, profile, prompts, register, templates, terms, workspace).

## Key conventions

- Backend models are **TypeScript interfaces only** (no Mongoose schemas). Collection names are constants.
- `Naming` — services export plain async functions, controllers call services, routes wire middleware + controller
- Validation — Zod schemas in `backend/src/validators/`, applied via `validate` middleware
- Error handling — centralized `error.middleware.ts` catches all `next(error)` calls
- Frontend imports use `@/` path alias (maps to `src/`)

## Notable quirks

- Backend `update()` services often call `findById()` internally rather than using `findOneAndUpdate` — be aware when reading the flow
- `backend/src/config/db.ts` — raw `MongoClient`, no connection pooling abstraction beyond the driver default
- `init-db.ts` — creates collections/indexes on startup
