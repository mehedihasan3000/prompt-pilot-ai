# PromptPilot AI — Implementation Plan

> A full-stack Agentic AI web application that helps users write better prompts for ChatGPT, Claude, Gemini, Groq, and other LLMs.

---

## Project Summary

**PromptPilot AI** is a SaaS-grade platform where users submit a prompt, configure their goal/model/tone, and the system runs a **multi-step agentic AI workflow** that:
1. Analyzes the prompt
2. Finds weaknesses & missing context
3. Asks smart follow-up questions
4. Generates an optimized prompt + multiple variants
5. Scores the prompt (0–100)
6. Recommends improvements
7. Auto-tags and saves to history

The application uses a **monorepo** structure with a Next.js frontend and a Node.js/Express backend, both in TypeScript, connected to MongoDB.

---

1. **Project root location**: `prompt-pilot-ai/` inside the workspace.
2. **AI API Keys**: I have API keys for **Gemini** and **Groq** ready.
3. **Google OAuth**: I have a Google Cloud project with OAuth credentials (`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`) set up for Better Auth.
4. **MongoDB**: I am using **MongoDB Atlas** I have a connection string.
5. **Deployment target**: Live deployment is listed in the checklist (Vercel for frontend, backend).
6. **AI Provider Priority**: The spec lists both Gemini and Groq. Should the **Prompt Analyzer/Optimizer** use Gemini (more capable) while the **Chat Assistant** uses Groq (faster streaming).
7. **Better Auth version**: **v1 (latest)** — updated API shape, new session management.
8. **AI Provider Fallback**: Enabled — try primary, fall back to secondary on failure.
9. **Package Manager**: **npm** — standard Node.js package manager.
10. **Chat Streaming**: **Express SSE directly** — frontend connects directly to Express `/api/ai/chat` SSE endpoint.
11. **DB Collections & Indexes**: **Auto on startup** — script runs when backend starts to ensure collections + indexes exist.

---

## Architecture Overview

```
prompt-pilot-ai/
├── frontend/          (Next.js 15 App Router, TypeScript, Tailwind CSS)
├── backend/           (Express.js, TypeScript, MongoDB native driver)
└── README.md
```

### Communication Pattern
- Frontend → Backend via REST API (`/api/*`)
- Backend → AI providers (Gemini SDK / Groq SDK) — **keys never exposed to frontend**
- Authentication via Better Auth sessions (HTTP-only cookies)
- Real-time chat streaming via Server-Sent Events (SSE) or streaming fetch

---

## Proposed Changes

### Phase 1 — Project Scaffolding & Setup

#### [NEW] `prompt-pilot-ai/` — Monorepo Root
- Root `README.md` with full documentation
- `.gitignore` for both workspaces

---

### Backend — `prompt-pilot-ai/backend/`

#### [NEW] Core Setup Files
| File | Purpose |
|------|---------|
| `package.json` | Node.js + TypeScript deps (express, cors, helmet, dotenv, bcrypt, mongodb, better-auth, @google/generative-ai, groq-sdk, express-rate-limit, zod) |
| `tsconfig.json` | Strict TypeScript config |
| `src/server.ts` | HTTP server entry point |
| `src/app.ts` | Express app config (CORS, Helmet, rate-limit, routes) |
| `.env.example` | Template for all required environment variables |

#### [NEW] `src/config/`
- `db.ts` — MongoDB native driver connection & singleton client
- `env.ts` — Validated environment variables via Zod
- `ai.ts` — Gemini and Groq client initialization

#### [NEW] `src/middlewares/`
- `auth.middleware.ts` — Better Auth session validation, JWT verification
- `validate.middleware.ts` — Zod request body validation factory
- `rateLimit.middleware.ts` — AI endpoint rate limiting (10 req/min per user)
- `error.middleware.ts` — Global error handler

#### [NEW] `src/models/` — TypeScript interfaces (no Mongoose, native MongoDB)
Each file exports a TypeScript type + collection name:
- `user.model.ts`
- `prompt.model.ts`
- `template.model.ts`
- `collection.model.ts`
- `conversation.model.ts`
- `message.model.ts`
- `review.model.ts`
- `recommendation.model.ts`
- `analytics.model.ts`

#### [NEW] `src/validators/` — Zod schemas matching DB models
- `auth.validator.ts`
- `prompt.validator.ts`
- `template.validator.ts`
- `collection.validator.ts`
- `review.validator.ts`

#### [NEW] `src/services/ai/` — AI Agent Logic

This is the **core of the agentic workflow**. Each service calls Gemini/Groq with carefully crafted prompt templates and returns structured JSON.

| Service File | Agent Responsibility |
|---|---|
| `planner.service.ts` | Understand goal, task type, context, optimization path |
| `analyzer.service.ts` | Check clarity, specificity, role, tone, output format, completeness |
| `contextChecker.service.ts` | Identify missing context points |
| `weaknessDetector.service.ts` | Find ambiguity, vague instructions, missing constraints |
| `followUp.service.ts` | Generate smart follow-up questions |
| `optimizer.service.ts` | Rewrite prompt into improved version with explanation |
| `variantGenerator.service.ts` | Generate 9 variants (Beginner, Professional, Short, Detailed, Claude, Gemini, ChatGPT, Few-shot, JSON-output) |
| `qualityEvaluator.service.ts` | Score 0–100 across 6 categories |
| `recommender.service.ts` | Suggest better role/tone/format/constraints |
| `autoTagger.service.ts` | Auto-generate tags and category |
| `chatAssistant.service.ts` | Context-aware chat with conversation history |
| `orchestrator.service.ts` | **Master service** — runs all agents in sequence, manages state |

**Prompt Engineering Templates** (in `src/prompts/`):
- `analyzer.prompt.ts` — Returns structured JSON with score, strengths, weaknesses, etc.
- `optimizer.prompt.ts` — Returns optimized prompt + changes explanation
- `variants.prompt.ts` — Returns array of 9 variant objects
- `recommender.prompt.ts` — Returns prioritized recommendation list
- `chat.prompt.ts` — Context-aware assistant system prompt

#### [NEW] `src/controllers/` — Route handlers (thin, delegate to services)
- `auth.controller.ts`
- `user.controller.ts`
- `prompt.controller.ts`
- `ai.controller.ts`
- `template.controller.ts`
- `collection.controller.ts`
- `review.controller.ts`
- `conversation.controller.ts`
- `analytics.controller.ts`

#### [NEW] `src/routes/` — Express routers
- `auth.routes.ts` — `/api/auth/*`
- `user.routes.ts` — `/api/users/*`
- `prompt.routes.ts` — `/api/prompts/*`
- `ai.routes.ts` — `/api/ai/*`
- `template.routes.ts` — `/api/templates/*`
- `collection.routes.ts` — `/api/collections/*`
- `review.routes.ts` — `/api/reviews/*`
- `conversation.routes.ts` — `/api/conversations/*`
- `analytics.routes.ts` — `/api/analytics/*`

#### [NEW] `src/services/` — Business logic services
- `auth.service.ts` — Register, login, Google OAuth, demo login
- `prompt.service.ts` — CRUD + favorite toggle
- `template.service.ts` — CRUD + usage increment
- `collection.service.ts` — CRUD + add/remove prompts
- `analytics.service.ts` — Aggregation pipelines for charts
- `recommendation.service.ts` — Fetch/store recommendations

#### Complete API Surface

```
# Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/demo-login
POST /api/auth/logout
GET  /api/auth/me

# Users
GET    /api/users/profile
PATCH  /api/users/profile
DELETE /api/users/account

# Prompts
POST   /api/prompts
GET    /api/prompts
GET    /api/prompts/:id
PATCH  /api/prompts/:id
DELETE /api/prompts/:id
PATCH  /api/prompts/:id/favorite

# AI Agents
POST /api/ai/analyze          — full agentic workflow
POST /api/ai/optimize         — optimizer only
POST /api/ai/generate-variants
POST /api/ai/score
POST /api/ai/recommend
POST /api/ai/chat             — streaming SSE response
POST /api/ai/auto-tag

# Templates
POST   /api/templates
GET    /api/templates         — public listing w/ search/filter/sort/pagination
GET    /api/templates/:id
PATCH  /api/templates/:id
DELETE /api/templates/:id
POST   /api/templates/:id/use

# Collections
POST   /api/collections
GET    /api/collections
GET    /api/collections/:id
PATCH  /api/collections/:id
DELETE /api/collections/:id
POST   /api/collections/:id/prompts
DELETE /api/collections/:id/prompts/:promptId

# Reviews
POST   /api/templates/:id/reviews
GET    /api/templates/:id/reviews
PATCH  /api/reviews/:id
DELETE /api/reviews/:id

# Conversations
POST   /api/conversations
GET    /api/conversations
GET    /api/conversations/:id
DELETE /api/conversations/:id
GET    /api/conversations/:id/messages

# Analytics
GET /api/analytics/summary
GET /api/analytics/prompts-over-time
GET /api/analytics/category-usage
GET /api/analytics/model-usage
GET /api/analytics/score-trends
```

---

### Frontend — `prompt-pilot-ai/frontend/`

#### [NEW] Setup Files
| File | Purpose |
|------|---------|
| `package.json` | Next.js 15, TypeScript, TailwindCSS, TanStack Query v5, Recharts, better-auth/react, Gravity UI Icons |
| `tailwind.config.ts` | Custom theme (Indigo primary, Emerald success, Amber accent, Slate neutral) |
| `next.config.ts` | API proxy rewrites to backend |
| `src/lib/queryClient.ts` | TanStack Query client config |
| `src/lib/auth.ts` | Better Auth client initialization |
| `src/lib/api.ts` | Typed fetch wrapper with error handling |

#### [NEW] Design System — `src/styles/`
- Custom Tailwind theme with exact color tokens from requirements:
  - `primary: #4F46E5` (Indigo)
  - `secondary: #10B981` (Emerald)
  - `accent: #F59E0B` (Amber)
  - `bg: #0F172A` (dark slate)
- Typography: **Plus Jakarta Sans** from Google Fonts
- Global animations: fade-in, slide-up, score counter animation

#### [NEW] Shared Components — `src/components/`

**Layout:**
- `Navbar.tsx` — Sticky, full-width, responsive, active route indicator, conditional auth buttons
- `Footer.tsx` — Functional links, social, copyright, privacy/terms
- `Sidebar.tsx` — Dashboard sidebar navigation (desktop)
- `MobileNav.tsx` — Collapsible mobile menu

**UI Primitives:**
- `Button.tsx` — variants: primary, secondary, ghost, danger; sizes: sm/md/lg
- `Input.tsx` — With label, error state, helper text
- `Select.tsx`, `Textarea.tsx`, `Badge.tsx`, `Avatar.tsx`
- `Modal.tsx` — Confirmation dialogs (delete actions)
- `Skeleton.tsx` — Card, row, chart skeleton loaders
- `EmptyState.tsx` — Contextual empty messages with icons
- `ErrorState.tsx` — With retry button
- `Toast.tsx` — Success/error notifications

**Cards:**
- `TemplateCard.tsx` — Same height/width/radius, 4/2/1 per row, image/icon, title, meta, CTA

**Charts (Recharts):**
- `ScoreOverTimeChart.tsx`
- `PromptsPerWeekChart.tsx`
- `CategoryPieChart.tsx`
- `ModelBarChart.tsx`
- `ScoreByCategoryChart.tsx`

**AI Components:**
- `WorkspaceForm.tsx` — All workspace input fields
- `AnalysisResult.tsx` — Score display, strengths/weaknesses panels
- `OptimizedPrompt.tsx` — With copy button
- `VariantCard.tsx` — Each prompt variant with copy
- `FollowUpQuestions.tsx` — Interactive Q&A
- `ScoreRing.tsx` — Animated circular score display
- `AgentProgress.tsx` — Step-by-step agent status indicator
- `ChatBubble.tsx`, `ChatInput.tsx`, `TypingIndicator.tsx`

---

#### [NEW] App Router Pages — `src/app/`

**Public Pages:**

| Route | Page | Key Features |
|---|---|---|
| `/` | `page.tsx` | Hero + 7+ sections (Features, How It Works, Workflow, Stats from DB, Testimonials, FAQ, CTA) |
| `/about` | `about/page.tsx` | Mission, team, AI workflow explanation |
| `/contact` | `contact/page.tsx` | Contact form → saves to DB, email, social |
| `/blog` | `blog/page.tsx` | Prompt engineering articles |
| `/privacy` | `privacy/page.tsx` | Privacy policy content |
| `/terms` | `terms/page.tsx` | Terms of service content |
| `/explore` | `explore/page.tsx` | Template listing: search, 5 filters, sort, pagination (8/12/16), skeleton loader, 4 cols |
| `/templates/:id` | `templates/[id]/page.tsx` | Template detail: images, description, key info, reviews, related templates, auth-gated actions |
| `/login` | `login/page.tsx` | Email/pass + Google + Demo login button |
| `/register` | `register/page.tsx` | Name, email, password, confirm password |

**Protected Pages:**

| Route | Page | Key Features |
|---|---|---|
| `/dashboard` | `dashboard/page.tsx` | 6 stat cards, 4 Recharts charts, recent activity |
| `/workspace` | `workspace/page.tsx` | Full workspace form + AI result display + agent progress |
| `/history` | `history/page.tsx` | Searchable, filterable, sortable prompt history |
| `/prompts/:id` | `prompts/[id]/page.tsx` | Single prompt detail with re-optimize |
| `/collections` | `collections/page.tsx` | Collection grid + add/edit/delete + view prompts |
| `/analytics` | `analytics/page.tsx` | 5 Recharts charts + 6 metrics |
| `/assistant` | `assistant/page.tsx` | Chat UI: bubbles, typing indicator, suggested prompts, history |
| `/profile` | `profile/page.tsx` | Edit name/image, password change, account delete |
| `/templates/add` | `templates/add/page.tsx` | Template form: all required fields + preview |
| `/templates/manage` | `templates/manage/page.tsx` | Table/grid of user's templates + CRUD actions |

---

#### [NEW] Hooks — `src/hooks/`
- `useAuth.ts` — Current user, login/logout mutations
- `usePrompts.ts` — TanStack Query for prompt CRUD
- `useTemplates.ts` — TanStack Query for template listing/CRUD
- `useCollections.ts` — Collection operations
- `useAnalytics.ts` — Analytics data fetching
- `useChat.ts` — Chat conversation state + SSE streaming
- `useWorkspace.ts` — Workspace form state + AI workflow state machine

#### [NEW] Services — `src/services/`
- `api/auth.ts`, `api/prompts.ts`, `api/templates.ts`, `api/ai.ts`, `api/analytics.ts`, `api/collections.ts`, `api/reviews.ts`, `api/conversations.ts`
- Each typed with request/response interfaces

#### [NEW] Types — `src/types/`
- `user.types.ts`, `prompt.types.ts`, `template.types.ts`, `collection.types.ts`, `ai.types.ts`, `analytics.types.ts`

---

## Database Schema Summary

```
MongoDB Collections:
├── users           — auth info, role, provider
├── prompts         — full prompt data + AI results + scores
├── templates       — public/private prompt templates
├── collections     — user folders for organizing prompts
├── conversations   — AI chat session headers
├── messages        — individual chat messages
├── recommendations — AI-generated recommendations
├── reviews         — template ratings and comments
└── analytics       — user event tracking
```

---

## Security Implementation

| Area | Implementation |
|---|---|
| Passwords | bcrypt (rounds: 12) |
| Sessions | Better Auth HTTP-only cookies |
| API Keys | Backend `.env` only, never in responses |
| Rate Limiting | `express-rate-limit`: 10 req/min on `/api/ai/*` |
| CORS | Whitelist frontend origin only |
| Helmet | All default headers enabled |
| Input Validation | Zod schemas on every POST/PATCH body |
| Authorization | Middleware checks `userId` ownership on all mutations |
| Route Protection | Next.js middleware for all `/dashboard`, `/workspace`, etc. |

---

## AI Provider Strategy

| Feature | Provider | Reason |
|---|---|---|
| Prompt Analyzer | **Gemini 1.5 Flash** | Complex reasoning + structured JSON output |
| Prompt Optimizer | **Gemini 1.5 Flash** | High-quality text generation |
| Variant Generator | **Gemini 1.5 Flash** | Multiple parallel generations |
| Quality Scorer | **Gemini 1.5 Flash** | Structured scoring rubric |
| Chat Assistant | **Groq (llama3-8b)** | Fast streaming, conversational |
| Auto Tagger | **Groq (llama3-8b)** | Fast, lightweight classification |
| Recommender | **Gemini 1.5 Flash** | Uses prompt history context |

---

## Landing Page Sections (Minimum 7)

1. **Hero** — Animated typing demo, "Before/After" prompt comparison, primary + secondary CTA
2. **Features** — 8 feature cards (Analyzer, Scorer, Optimizer, Follow-ups, History, Collections, Chat, Analytics)
3. **How It Works** — 6-step numbered timeline with icons
4. **AI Agent Workflow** — Visual pipeline: Input → Analyze → Ask → Optimize → Score → Recommend → Save
5. **Prompt Templates** — 4-column preview of real templates from DB (skeleton if loading)
6. **Statistics** — Live DB-driven counters (prompts optimized, avg score, templates, users)
7. **Testimonials** — Shown only if real testimonials exist in DB; otherwise hidden with message
8. **FAQ** — 6+ real app FAQs with accordion UI
9. **Newsletter / Final CTA** — Email capture form

---

## Phased Build Order (MVP → Full)

### Phase 1 — Foundation (Week 1)
- [ ] Monorepo scaffold (backend + frontend)
- [ ] TypeScript config, linting, prettier
- [ ] MongoDB connection + model types
- [ ] Better Auth setup (email + Google + demo)
- [ ] Tailwind design system + global styles
- [ ] Navbar, Footer, layout components
- [ ] Landing page (all 9 sections)
- [ ] Login, Register pages

### Phase 2 — Core Feature (Week 2)
- [ ] AI service layer (all 8 agent services)
- [ ] Prompt Engineering prompt templates
- [ ] `/api/ai/analyze` endpoint (full orchestrator)
- [ ] `/api/ai/optimize`, `/api/ai/generate-variants`, `/api/ai/score`
- [ ] Prompt Workspace page (form + result display)
- [ ] Agent progress indicator UI

### Phase 3 — Data Management (Week 3)
- [ ] Prompt CRUD API + frontend History page
- [ ] Template CRUD API + Explore page (search/filter/sort/pagination)
- [ ] Template Details page (public + auth-gated actions)
- [ ] Add Template + Manage Templates pages
- [ ] Collections CRUD + UI

### Phase 4 — Advanced Features (Week 4)
- [ ] AI Chat Assistant (SSE streaming)
- [ ] Reviews & Ratings system
- [ ] Analytics page (5 charts)
- [ ] Dashboard (6 cards + 4 charts + recent activity)
- [ ] Auto-tagging on prompt save
- [ ] Recommendation Engine

### Phase 5 — Polish (Week 5)
- [ ] Profile page
- [ ] About, Contact, Blog, Privacy, Terms pages
- [ ] Skeleton loaders on every page
- [ ] Empty states + error states
- [ ] Responsive design audit (mobile/tablet/desktop)
- [ ] SEO meta tags on every page
- [ ] README.md
- [ ] Deployment config

---

## Verification Plan

### Automated Tests
```bash
# Backend
cd backend && npm test           # Jest unit tests for AI services
cd backend && npm run test:api   # Supertest integration tests for all routes

# Frontend
cd frontend && npm run build     # TypeScript compile check
cd frontend && npm run lint      # ESLint
```

### Manual Verification Checklist
- [ ] Register with email → verify session persists
- [ ] Login with Google → verify profile populated
- [ ] Demo login → verify auto-credentials work
- [ ] Submit prompt in workspace → verify all 8 agent outputs display
- [ ] Score ring animates correctly (0 → actual score)
- [ ] Copy optimized prompt to clipboard
- [ ] Save prompt → appears in History
- [ ] Search + filter in Explore page works
- [ ] Add template → appears in Explore
- [ ] Delete template → confirmation modal → removed from list
- [ ] Add review → updates average rating on card
- [ ] Chat assistant responds + shows typing indicator
- [ ] Analytics charts populate with real data
- [ ] Dashboard stats reflect actual DB counts
- [ ] Mobile responsive: navbar collapses, cards stack to 1 column
- [ ] Protected routes redirect to `/login` when logged out
- [ ] Rate limiting: >10 rapid AI requests → 429 response
