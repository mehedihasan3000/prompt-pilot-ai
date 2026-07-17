# PromptPilot AI

> Analyze, optimize, and organize powerful AI prompts with an intelligent agentic workflow.

PromptPilot AI is a full-stack Agentic AI web application that helps users write better prompts for ChatGPT, Claude, Gemini, Groq, and other LLMs.

## Features

- **AI Prompt Analyzer** — Detects unclear instructions, missing context, weak role definition, and more
- **AI Prompt Optimizer** — Rewrites prompts into clearer, stronger versions with explanation
- **Prompt Scoring** — Scores prompts 0-100 across 6 categories (Clarity, Context, Specificity, Constraints, Output Format, Tone Alignment)
- **9 Prompt Variants** — Generates Beginner-friendly, Professional, Short, Detailed, Claude/Gemini/ChatGPT-optimized, Few-shot, and JSON-output versions
- **Follow-up Questions** — AI asks smart questions when prompts are incomplete
- **AI Chat Assistant** — Conversational assistant for prompt engineering help (SSE streaming)
- **Auto Tagging & Classification** — Automatically categorizes and tags saved prompts
- **AI Recommendations** — Suggests improvements based on prompt analysis
- **Prompt History** — Search, filter, sort, and manage saved prompts
- **Collections** — Organize prompts into custom collections
- **Prompt Templates** — Browse, create, and share reusable prompt templates
- **Reviews & Ratings** — Rate and review community templates
- **Analytics Dashboard** — Visualize prompt usage, scores, and trends with Recharts
- **Authentication** — Email/password, Google OAuth, and Demo login via Better Auth

## Agentic AI Workflow

```
User Input → Planner Agent → Analyzer Agent → Context Checker → Weakness Detector
→ Follow-up Questions → Optimization Agent → Variant Generator → Quality Evaluator
→ Recommendation Agent → Auto Tagger → Saved Result
```

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query v5
- Recharts
- Better Auth (React client)
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (native driver, no Mongoose)
- Better Auth v1
- Zod (validation)

### AI Providers
- **Gemini 1.5 Flash** — Analyzer, Optimizer, Variant Generator, Quality Evaluator, Recommender
- **Groq (llama3-8b)** — Chat Assistant, Auto Tagger

## Project Structure

```
prompt-pilot-ai/
├── frontend/                # Next.js 16 application
│   └── src/
│       ├── app/             # App Router pages (15 routes)
│       ├── components/      # UI, layout, cards, charts, AI components
│       ├── hooks/           # TanStack Query hooks
│       ├── lib/             # API client, auth client, query client
│       ├── services/api/    # Typed API service modules
│       ├── types/           # TypeScript interfaces
│       └── styles/          # Global CSS + Tailwind
├── backend/                 # Express.js API server
│   └── src/
│       ├── config/          # DB, env, AI client config
│       ├── controllers/     # Route handlers (9 controllers)
│       ├── middlewares/      # Auth, validation, rate limiting, error handling
│       ├── models/          # TypeScript interfaces (9 collections)
│       ├── routes/          # Express routers (9 route files)
│       ├── services/        # Business logic + AI agents
│       │   └── ai/          # 12 AI agent services + orchestrator
│       ├── prompts/         # Prompt engineering templates
│       └── validators/      # Zod validation schemas
├── .opencoderules           # OpenCode AI rules
├── TASKS.md                 # Living project roadmap
└── implementation_plan.md   # Architecture & implementation plan
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 4000) |
| `MONGODB_URI` | MongoDB connection string |
| `DATABASE_NAME` | MongoDB database name |
| `BETTER_AUTH_SECRET` | Better Auth secret key |
| `BETTER_AUTH_URL` | Frontend URL (http://localhost:3000) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GROQ_API_KEY` | Groq API key |

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd prompt-pilot-ai

# Install backend dependencies
cd backend
npm install
cp .env.example .env   # Edit .env with your values

# Install frontend dependencies
cd ../frontend
npm install

# Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

The frontend runs on http://localhost:3000 and the backend on http://localhost:4000.

## API Documentation

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/demo-login` | Demo login (demo@promptpilot.ai) |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### AI Agents
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/analyze` | Full agentic workflow (all 10 agents) |
| POST | `/api/ai/optimize` | Optimize prompt only |
| POST | `/api/ai/generate-variants` | Generate 9 prompt variants |
| POST | `/api/ai/score` | Score prompt (0-100) |
| POST | `/api/ai/recommend` | Get improvement recommendations |
| POST | `/api/ai/chat` | Chat assistant (SSE streaming) |
| POST | `/api/ai/auto-tag` | Auto-generate tags & category |

### Data APIs
- `GET/POST /api/prompts` — List/Create prompts
- `GET/PATCH/DELETE /api/prompts/:id` — CRUD single prompt
- `PATCH /api/prompts/:id/favorite` — Toggle favorite
- `GET/POST /api/templates` — List/Create templates
- `GET/PATCH/DELETE /api/templates/:id` — CRUD single template
- `POST /api/templates/:id/use` — Increment usage count
- `GET/POST /api/collections` — List/Create collections
- `GET/PATCH/DELETE /api/collections/:id` — CRUD collection
- `POST/DELETE /api/collections/:id/prompts` — Manage collection prompts
- `GET/POST /api/templates/:id/reviews` — List/Create reviews
- `GET /api/analytics/*` — Analytics data

## Live Demo

[Demo Link Placeholder]

Demo credentials: `demo@promptpilot.ai` / `Pa$$w0rd!`

## License

MIT
