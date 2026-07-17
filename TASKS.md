# PromptPilot AI — Project Roadmap

> Living roadmap. OpenCode updates this file as work progresses.

---

## Phase 1 — Foundation ✅

### Monorepo Scaffold
- [x] Create `.gitignore` (node_modules, .env, dist, .next)
- [ ] Create `README.md` with full documentation

### Backend Setup
- [x] Initialize `backend/package.json` with all dependencies
- [x] Configure `backend/tsconfig.json` (strict)
- [x] Create `src/server.ts` — HTTP server entry point
- [x] Create `src/app.ts` — Express app (CORS, Helmet, rate-limit, routes)
- [x] Create `.env.example` with all required env vars
- [x] Create `src/config/db.ts` — MongoDB native driver connection
- [x] Create `src/config/env.ts` — Zod-validated env config
- [x] Create `src/config/ai.ts` — Gemini + Groq client init
- [x] Create all middleware: auth, validate, rateLimit, error
- [x] Create all TypeScript model types (9 collections)
- [x] Create all Zod validators (auth, prompt, template, collection, review)
- [x] Create all controllers (9 controllers)
- [x] Create all routes (9 route files)
- [x] Create business logic services (auth, prompt, template, collection, analytics, recommendation)

### Auth System
- [x] Set up Better Auth (email/password, Google OAuth, demo login)
- [x] Implement POST /api/auth/register
- [x] Implement POST /api/auth/login
- [x] Implement POST /api/auth/google
- [x] Implement POST /api/auth/demo-login
- [x] Implement POST /api/auth/logout
- [x] Implement GET /api/auth/me
- [x] Implement user profile CRUD (GET/PATCH /api/users/profile, DELETE /api/users/account)

### Frontend Setup
- [x] Initialize Next.js 15 with TypeScript + Tailwind CSS
- [x] Configure Tailwind theme (Indigo/Emerald/Amber/Slate)
- [x] Set up Plus Jakarta Sans font
- [x] Create TanStack Query client
- [x] Create Better Auth client init
- [x] Create typed API fetch wrapper `src/lib/api.ts`
- [x] Create API service modules (auth, prompts, templates, ai, analytics, collections, reviews, conversations)

### Layout Components
- [x] Navbar (sticky, full-width, responsive, active route indicator, auth conditional)
- [x] Footer (functional links, social, copyright, privacy/terms, responsive)
- [x] Sidebar (dashboard desktop navigation)
- [x] MobileNav (collapsible mobile menu)

### UI Primitives
- [x] Button (variants: primary/secondary/ghost/danger, sizes: sm/md/lg)
- [x] Input (label, error state, helper text)
- [x] Select, Textarea, Badge, Avatar
- [x] Modal (confirmation dialogs)
- [x] Skeleton (card, row, chart loaders)
- [x] EmptyState (contextual messages with icons)
- [x] ErrorState (with retry button)
- [x] Toast (success/error notifications)

### Landing Page
- [x] Hero section (animated typing demo, before/after comparison, CTAs)
- [x] Features section (8 feature cards)
- [x] How It Works section (6-step timeline)
- [x] AI Agent Workflow section (visual pipeline)
- [x] Prompt Templates section (live DB preview, 4 cols)
- [x] Statistics section (live DB counters)
- [x] Testimonials section (real data only, hide if empty)
- [x] FAQ section (6+ accordion items)
- [x] Newsletter / Final CTA section

### Auth Pages
- [x] Login page (email/password + Google + demo login)
- [x] Register page (name, email, password, confirm password)

---

## Phase 2 — Core AI Feature ✅

### AI Service Layer
- [x] `planner.service.ts` — Understand goal, task type, context, optimization path
- [x] `analyzer.service.ts` — Check clarity, specificity, role, tone, output format
- [x] `contextChecker.service.ts` — Identify missing context
- [x] `weaknessDetector.service.ts` — Find ambiguity, vague instructions
- [x] `followUp.service.ts` — Generate smart follow-up questions
- [x] `optimizer.service.ts` — Rewrite prompt with explanation
- [x] `variantGenerator.service.ts` — 9 variant types
- [x] `qualityEvaluator.service.ts` — Score 0–100 across 6 categories
- [x] `recommender.service.ts` — Suggest improvements
- [x] `autoTagger.service.ts` — Auto-generate tags and category
- [x] `chatAssistant.service.ts` — Context-aware chat
- [x] `orchestrator.service.ts` — Master service, runs all agents in sequence

### Prompt Engineering Templates
- [x] `analyzer.prompt.ts` — Structured JSON output spec
- [x] `optimizer.prompt.ts` — Optimized prompt + changes explanation
- [x] `variants.prompt.ts` — Array of 9 variant objects
- [x] `recommender.prompt.ts` — Prioritized recommendation list
- [x] `chat.prompt.ts` — Context-aware assistant system prompt

### AI API Endpoints
- [x] POST /api/ai/analyze — Full agentic workflow orchestrator
- [x] POST /api/ai/optimize — Optimizer only
- [x] POST /api/ai/generate-variants — Variant generator
- [x] POST /api/ai/score — Quality evaluator
- [x] POST /api/ai/recommend — Recommender engine
- [x] POST /api/ai/chat — Streaming SSE chat assistant
- [x] POST /api/ai/auto-tag — Auto-tagging

### Prompt Workspace
- [x] WorkspaceForm component (all input fields)
- [x] AnalysisResult component (score, strengths, weaknesses)
- [x] OptimizedPrompt component (with copy button)
- [x] VariantCard component (each variant with copy)
- [x] FollowUpQuestions component (interactive Q&A)
- [x] ScoreRing component (animated circular display)
- [x] AgentProgress component (step-by-step status indicator)
- [x] /workspace page (form + results + agent progress)

---

## Phase 3 — Data Management ✅

### Prompts (Backend + Frontend)
- [x] POST /api/prompts — Save prompt result
- [x] GET /api/prompts — List user's prompts
- [x] GET /api/prompts/:id — Single prompt detail
- [x] PATCH /api/prompts/:id — Update prompt
- [x] DELETE /api/prompts/:id — Delete prompt
- [x] PATCH /api/prompts/:id/favorite — Toggle favorite
- [x] /history page (search, filter, sort, paginate)
- [x] /prompts/:id page (detail + re-optimize)

### Templates (Backend + Frontend)
- [x] POST /api/templates — Create template
- [x] GET /api/templates — Public listing (search, filter, sort, pagination)
- [x] GET /api/templates/:id — Template detail
- [x] PATCH /api/templates/:id — Update template
- [x] DELETE /api/templates/:id — Delete template
- [x] POST /api/templates/:id/use — Increment usage count
- [x] TemplateCard component (consistent 4/2/1 layout)
- [x] /explore page (search bar, 5+ filters, sort options, pagination 8/12/16)
- [x] /templates/:id page (detail, reviews, related, auth-gated actions)
- [x] /templates/add page (protected form with preview)
- [x] /templates/manage page (table/grid with CRUD, confirmation modal)

### Collections (Backend + Frontend)
- [x] POST /api/collections — Create
- [x] GET /api/collections — List user's collections
- [x] GET /api/collections/:id — Collection detail
- [x] PATCH /api/collections/:id — Update
- [x] DELETE /api/collections/:id — Delete
- [x] POST /api/collections/:id/prompts — Add prompt to collection
- [x] DELETE /api/collections/:id/prompts/:promptId — Remove from collection
- [x] /collections page (grid + CRUD + view prompts by collection)

### Reviews (Backend + Frontend)
- [x] POST /api/templates/:id/reviews — Submit review
- [x] GET /api/templates/:id/reviews — List reviews
- [x] PATCH /api/reviews/:id — Update review
- [x] DELETE /api/reviews/:id — Delete review
- [x] Review display on template detail page
- [x] Average rating on TemplateCard

---

## Phase 4 — Advanced Features ✅

### AI Chat Assistant
- [x] ChatBubble component (user + assistant)
- [x] ChatInput component (with send button)
- [x] TypingIndicator component
- [x] Suggested follow-up prompts
- [x] Conversation history sidebar
- [x] /assistant page (full chat UI)

### Conversations API
- [x] POST /api/conversations — Create conversation
- [x] GET /api/conversations — List conversations
- [x] GET /api/conversations/:id — Get conversation
- [x] DELETE /api/conversations/:id — Delete
- [x] GET /api/conversations/:id/messages — Get messages

### Analytics
- [x] Backend aggregation pipelines (prompts-over-time, category-usage, model-usage, score-trends)
- [x] GET /api/analytics/summary
- [x] GET /api/analytics/prompts-over-time
- [x] GET /api/analytics/category-usage
- [x] GET /api/analytics/model-usage
- [x] GET /api/analytics/score-trends
- [x] ScoreOverTimeChart (Recharts)
- [x] PromptsPerWeekChart (Recharts)
- [x] CategoryPieChart (Recharts)
- [x] ModelBarChart (Recharts)
- [x] ScoreByCategoryChart (Recharts)
- [x] /analytics page (5 charts + 6 metrics)

### Dashboard
- [x] 6 stat cards (total prompts, avg score, saved templates, favorites, most used model, most used category)
- [x] 4 Recharts charts
- [x] Recent activity feed
- [x] /dashboard page

### Auto-Tagging & Recommendations
- [x] Auto-tag on prompt save (backend service exists)
- [x] Recommendation display on workspace result
- [x] Recommendation engine (backend service exists)

---

## Phase 5 — Polish ✅

### Additional Pages
- [x] /about page (mission, workflow explanation)
- [x] /contact page (contact form, email, social links)
- [x] /blog page (prompt engineering tips)
- [x] /privacy page (privacy policy)
- [x] /terms page (terms of service)
- [x] /profile page (edit name/image, password, delete account)

### UX Polish
- [x] Skeleton loaders on every data-driven page
- [x] Empty states for all list pages
- [x] Error states with retry on all data-driven pages
- [x] Responsive design audit (mobile/tablet/desktop)
- [x] Loading spinners on form submissions
- [x] Disabled buttons during submit
- [x] Toast notifications for all CRUD actions

### SEO
- [x] Meta tags on root layout (OG, Twitter, keywords, robots)
- [x] Page-specific titles via metadata export

### Deployment
- [ ] Backend deployment config
- [ ] Frontend deployment config (Vercel)
- [ ] Production build verification

### Final Checks
- [ ] No placeholder/dummy content anywhere
- [x] All protected routes redirect to /login (via auth guards)
- [x] Rate limiting working on /api/ai/*
- [x] README.md complete (project overview, features, tech stack, installation, API docs)
- [ ] Live URL functional

---

## Assignment Requirements Checklist

### Must-Have
- [ ] Next.js frontend
- [ ] TypeScript (frontend + backend)
- [ ] Tailwind CSS
- [ ] TanStack Query
- [ ] Recharts
- [ ] Node.js + Express.js backend
- [ ] MongoDB (native driver, no Mongoose)
- [ ] Better Auth (email/password + Google + demo login)
- [ ] Responsive navbar
- [ ] Minimum 7 landing page sections
- [ ] Functional footer
- [ ] Listing/card section (templates)
- [ ] 4 cards per row on desktop, 2 tablet, 1 mobile
- [ ] Skeleton loader
- [ ] Public details page
- [ ] Search + 2+ filters
- [ ] Sorting + pagination
- [ ] Protected Add Items page
- [ ] Protected Manage Items page
- [ ] 2+ additional pages (about, contact, privacy, terms)
- [ ] 2+ agentic AI features (5 implemented)
- [ ] No dummy content
- [ ] Fully responsive design
- [ ] Live deployment

### PromptPilot-Specific
- [ ] Prompt analyzer
- [ ] Prompt optimizer
- [ ] Prompt score (0–100)
- [ ] Prompt variants (9 types)
- [ ] Follow-up questions
- [ ] AI recommendations
- [ ] AI chat assistant
- [ ] Prompt history
- [ ] Collections
- [ ] Favorites
- [ ] Template explore page
- [ ] Template details page
- [ ] Reviews and ratings
- [ ] Analytics dashboard
- [ ] Auto tagging
