import type { Metadata } from 'next';
import {
  Search,
  Star,
  Sparkles,
  MessageSquare,
  Target,
  Lightbulb,
  FileText,
  Layers,
  Users,
  GraduationCap,
  Code2,
  PenTool,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about PromptPilot AI - the intelligent prompt optimization platform that helps you write better AI prompts for ChatGPT, Claude, Gemini, and more.',
};

const features = [
  {
    icon: Search,
    title: 'Deep Prompt Analysis',
    description:
      'AI-powered analysis that evaluates your prompts across clarity, specificity, context, structure, and constraints dimensions.',
  },
  {
    icon: Star,
    title: 'Multi-Dimension Scoring',
    description:
      'Comprehensive scoring with detailed breakdowns and actionable improvement suggestions for each quality dimension.',
  },
  {
    icon: Sparkles,
    title: 'Smart Optimization',
    description:
      'Automatically generate optimized versions of your prompts with measurable score improvements.',
  },
  {
    icon: MessageSquare,
    title: 'Clarifying Questions',
    description:
      'Intelligent follow-up questions to better understand your intent before generating improvements.',
  },
  {
    icon: Layers,
    title: 'Collections & Organization',
    description:
      'Organize prompts into collections, track versions, and manage your prompt library efficiently.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Detailed analytics on prompt quality trends, model usage, category distribution, and personal progress.',
  },
];

const audience = [
  {
    icon: GraduationCap,
    title: 'Students & Researchers',
    description: 'Write better prompts for academic research, literature reviews, and data analysis tasks.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Code2,
    title: 'Software Developers',
    description: 'Optimize prompts for code generation, debugging, documentation, and API integration.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: PenTool,
    title: 'Content Creators',
    description: 'Craft effective prompts for content writing, social media, marketing copy, and creative projects.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Target,
    title: 'Marketers & Strategists',
    description: 'Develop data-driven prompts for market research, SEO analysis, and campaign planning.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const workflowSteps = [
  { step: '01', title: 'Input Prompt', description: 'Write or paste your original prompt into the workspace.' },
  { step: '02', title: 'Set Goal', description: 'Define the objective and context for your prompt.' },
  { step: '03', title: 'AI Analyzes', description: 'Agents evaluate across five quality dimensions.' },
  { step: '04', title: 'Score Generated', description: 'A multi-dimensional score with detailed breakdown.' },
  { step: '05', title: 'Clarifying Q&A', description: 'AI asks targeted questions to refine understanding.' },
  { step: '06', title: 'Optimization', description: 'Multiple optimized versions with improved scores.' },
  { step: '07', title: 'Side-by-Side Compare', description: 'Compare original and optimized versions.' },
  { step: '08', title: 'Model Targeting', description: 'Tailored suggestions for your target AI model.' },
  { step: '09', title: 'Save & Organize', description: 'Save to collections with version tracking.' },
  { step: '10', title: 'Track Progress', description: 'Monitor your improvement through analytics.' },
];

const agents = [
  { icon: FileText, name: 'Input Handler', desc: 'Processes raw prompts' },
  { icon: Search, name: 'Analyzer', desc: 'Deep prompt analysis' },
  { icon: Star, name: 'Scorer', desc: 'Quality scoring engine' },
  { icon: MessageSquare, name: 'Questioner', desc: 'Clarifying questions' },
  { icon: Lightbulb, name: 'Optimizer', desc: 'Improvement engine' },
  { icon: Target, name: 'Model Matcher', desc: 'Model-specific tuning' },
  { icon: Layers, name: 'Organizer', desc: 'Storage & versioning' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About PromptPilot AI
            </h1>
            <p className="mt-6 text-lg text-indigo-200 sm:text-xl">
              PromptPilot AI is an intelligent prompt optimization platform that analyzes, scores, and
              enhances your AI prompts using a multi-agent workflow. Built for developers, content
              creators, and researchers who want to get the best results from AI models.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Mission</h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              The quality of AI output is directly tied to the quality of your prompt. Yet most users
              write vague, unstructured prompts that lead to mediocre results. PromptPilot AI bridges
              this gap by providing intelligent, data-driven prompt optimization that anyone can use.
            </p>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              We believe that effective prompt engineering should not require years of experience. Our
              platform makes expert-level prompt optimization accessible through automated analysis,
              intelligent scoring, and actionable recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* AI Workflow */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">AI Agent Workflow</h2>
            <p className="mt-4 text-lg text-slate-600">
              A 10-step pipeline powered by specialized AI agents working in sequence.
            </p>
          </div>

          {/* Agent Pipeline */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div key={agent.name} className="flex items-center gap-3">
                  <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-center transition-colors hover:border-primary-300 hover:shadow-sm">
                    <Icon className="mb-1 h-5 w-5 text-primary-600" />
                    <span className="text-sm font-semibold text-slate-900">{agent.name}</span>
                    <span className="text-xs text-slate-500">{agent.desc}</span>
                  </div>
                  {i < agents.length - 1 && (
                    <ChevronRight className="hidden h-4 w-4 text-slate-400 sm:block" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Workflow Steps */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <span className="inline-block rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                  Step {item.step}
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Who It Helps</h2>
            <p className="mt-4 text-lg text-slate-600">
              PromptPilot AI is designed for anyone who interacts with AI language models.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audience.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-primary-200 hover:shadow-md"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${item.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Key Features</h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to craft high-quality AI prompts.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-primary-200 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
