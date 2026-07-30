# PromptPilot AI — Agent Guide

## Dev commands

```bash
# Backend
cd backend && npm run dev          # tsx watch src/server.ts (port 4000)
npm run build                       # tsc -> dist/
npm start                           # node dist/server.js
npx tsc --noEmit                    # typecheck

# Frontend
cd frontend && npm run dev          # next dev (port 3000)
npm run build                       # next build
npm run lint                        # next lint
npx tsc --noEmit                    # typecheck
```

No test framework exists.

## Architecture

**Monorepo** — two independent packages (no workspace manager):
- `backend/` — Express.js + native MongoDB driver (no Mongoose)
- `frontend/` — Next.js 16 App Router + TanStack Query v5

Backend entrypoint: `backend/src/server.ts` — connects DB, initializes collections/indexes, then starts Express.

Frontend API client: `frontend/src/lib/api.ts` — prepends `/api`, attaches `x-user-id` header from `localStorage` (`auth_token`). Uses `NEXT_PUBLIC_API_URL` or falls back to `http://localhost:4000`.

Dev proxy: `frontend/next.config.ts` rewrites `/api/*` → `http://localhost:4000/api/*` in dev mode.

## API response envelope

Every response: `{ success: boolean, data: T }`. Errors: `{ success: false, error: string }`.
Controllers unpack service results into `data`, never return raw service output.

## Auth

Backend middleware (`auth.middleware.ts`) reads `x-user-id` header as the user's MongoDB `_id` string — **no session validation yet** (`// TODO` uses Better Auth v1 instead).

Frontend stores `x-user-id` value in `localStorage` under `auth_token`. The `apiFetch` helper attaches it automatically.

There is also `frontend/src/lib/auth.ts` using Better Auth React client (`createAuthClient()`), but it is **not wired to the backend middleware**. Both auth paths coexist.

## MongoDB _id / id mapping

MongoDB returns `_id`. Frontend types all use `id`. Every service must map `_id` → `id` using the shared utility:

```ts
mapDoc<T>(doc)    // single: { _id, ...rest } → { id, ...rest }
mapDocs<T>(docs)  // array of docs
```

Always use these when querying MongoDB.

## AI

11 agent services + orchestrator under `backend/src/services/ai/`.

**Primary provider**: Groq (`llama-3.1-8b-instant`) via `callAi()` in `ai.utils.ts`.
**Fallback**: Gemini 2.5 Flash if Groq fails.
**SSE streaming** (chat assistant): Express SSE directly — no Next.js proxy.

AI routes rate-limited at 10 req/min, general routes at 100 req/min.

## CORS

Backend CORS origin = `env.BETTER_AUTH_URL` (default `http://localhost:3000`).

## Env

All env vars validated at startup via Zod (`backend/src/config/env.ts`). Missing vars crash on boot.
`backend/.env.example` lists all required vars.

## Key conventions

- Backend models are **TypeScript interfaces only** (no Mongoose schemas). Collection names are string constants.
- Validation: Zod schemas in `backend/src/validators/`, applied via `validate` middleware.
- Error handling: centralized `error.middleware.ts` catches all `next(error)`.
- Frontend imports use `@/` path alias (maps to `src/`).
- Backend `update()` services often call `findById()` then update, rather than `findOneAndUpdate`.
- `backend/src/config/init-db.ts` creates collections and indexes on startup.

## Routing

Backend routes under `/api/*`:
- `/api/auth/*` — register, login, google, demo-login, logout, me
- `/api/users/*` — profile update, account delete
- `/api/prompts/*` — CRUD + toggle favorite
- `/api/templates/*` — CRUD + increment usage
- `/api/collections/*` — CRUD + add/remove prompts
- `/api/reviews/*` — CRUD per template
- `/api/conversations/*` — chat conversation CRUD + messages
- `/api/ai/*` — analyze, optimize, variants, score, recommend, chat (SSE), auto-tag
- `/api/analytics/*` — dashboard stats

Frontend routes match the directory structure under `frontend/src/app/`.
