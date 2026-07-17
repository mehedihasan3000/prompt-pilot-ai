'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Zap,
  Search,
  Sparkles,
  MessageSquare,
  Clock,
  FolderOpen,
  Bot,
  BarChart3,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Lightbulb,
  Target,
  Layout,
  CheckCircle,
  FileText,
  Star,
  TrendingUp,
  Users,
  Layers,
  ArrowUp,
  Loader2,
  Mail,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const features = [
  {
    icon: Search,
    title: 'Prompt Analysis',
    description: 'Get deep AI-powered analysis of your prompts with actionable feedback on clarity, specificity, and structure.',
  },
  {
    icon: Star,
    title: 'AI Scoring',
    description: 'Score your prompts across five dimensions with detailed breakdowns and improvement suggestions.',
  },
  {
    icon: Sparkles,
    title: 'Smart Optimization',
    description: 'Automatically generate optimized versions of your prompts with measurable improvements.',
  },
  {
    icon: MessageSquare,
    title: 'Follow-up Questions',
    description: 'The AI asks intelligent questions to better understand your intent before optimizing.',
  },
  {
    icon: Clock,
    title: 'Prompt History',
    description: 'Access your complete prompt history with version tracking and comparison tools.',
  },
  {
    icon: FolderOpen,
    title: 'Collections',
    description: 'Organize your prompts into collections for easy retrieval and project management.',
  },
  {
    icon: Bot,
    title: 'AI Chat Assistant',
    description: 'Chat with an AI assistant that helps refine and improve your prompts in real time.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your progress with detailed analytics on prompt quality, scores, and usage patterns.',
  },
];

const steps = [
  { number: 1, title: 'Write Prompt', description: 'Enter your original prompt in the workspace editor.' },
  { number: 2, title: 'Add Goal', description: 'Describe what you want the AI to achieve with your prompt.' },
  { number: 3, title: 'AI Analyzes', description: 'Our AI analyzes your prompt across five quality dimensions.' },
  { number: 4, title: 'Answer Questions', description: 'Answer clarifying questions to refine the AI\'s understanding.' },
  { number: 5, title: 'Get Optimized Versions', description: 'Receive multiple optimized versions with improved scores.' },
  { number: 6, title: 'Save & Organize', description: 'Save your best prompts to collections for future reuse.' },
];

const agents = [
  { icon: FileText, name: 'Input', description: 'Original prompt' },
  { icon: Search, name: 'Analyze', description: 'Deep analysis engine' },
  { icon: MessageSquare, name: 'Ask', description: 'Question generator' },
  { icon: Sparkles, name: 'Optimize', description: 'Improvement engine' },
  { icon: Star, name: 'Score', description: 'Quality scorer' },
  { icon: Lightbulb, name: 'Recommend', description: 'Suggestion engine' },
  { icon: FolderOpen, name: 'Save', description: 'Storage manager' },
];

const faqs = [
  {
    question: 'What is PromptPilot AI?',
    answer: 'PromptPilot AI is an intelligent prompt optimization platform that analyzes your prompts, finds weaknesses, asks clarifying questions, and generates optimized versions for AI models like ChatGPT, Claude, and Gemini.',
  },
  {
    question: 'Which AI models does it support?',
    answer: 'PromptPilot AI works with prompts designed for ChatGPT, Claude, Gemini, Llama, and most major AI models. The optimization techniques are model-agnostic, though we provide model-specific suggestions when relevant.',
  },
  {
    question: 'Can I save my prompts?',
    answer: 'Yes! You can save prompts to your personal library, organize them into collections, and access your complete prompt history at any time.',
  },
  {
    question: 'Is my prompt history private?',
    answer: 'Absolutely. Your prompts are private by default and only accessible to you. We do not share or use your prompts for training purposes without explicit consent.',
  },
  {
    question: 'Can I organize prompts by category?',
    answer: 'Yes, you can create collections to organize your prompts by project, use case, or any category you prefer. Prompts can belong to multiple collections.',
  },
  {
    question: 'How does the AI analysis work?',
    answer: 'Our AI analyzes your prompt across five dimensions: clarity, specificity, context, structure, and constraints. It provides a score for each dimension along with specific, actionable recommendations for improvement.',
  },
];

const statsData = [
  { icon: Zap, label: 'Prompts Optimized', value: 12500, suffix: '+' },
  { icon: Star, label: 'Average Score', value: 87, suffix: '%' },
  { icon: Layers, label: 'Templates Available', value: 250, suffix: '+' },
  { icon: Users, label: 'Active Users', value: 3200, suffix: '+' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function TemplateCard({ template }: { template: { id: string; title: string; description: string; category: string } }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-primary-200 hover:shadow-md">
      <div className="mb-3">
        <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
          {template.category}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-primary-600">
        {template.title}
      </h3>
      <p className="mb-4 text-sm text-slate-500 line-clamp-2">{template.description}</p>
      <Link
        href={`/explore/${template.id}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        Use Template <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function TestimonialCard({ review }: { review: { id: string; name: string; role?: string; content: string; rating: number } }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
          />
        ))}
      </div>
      <p className="mb-4 text-sm text-slate-600 italic leading-relaxed">&ldquo;{review.content}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{review.name}</p>
          {review.role && <p className="text-xs text-slate-500">{review.role}</p>}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);
  const [beforeAfter, setBeforeAfter] = useState(false);

  const [templates, setTemplates] = useState<any[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [templatesRes, reviewsRes] = await Promise.all([
          fetch('/api/templates?limit=4&sort=usageCount'),
          fetch('/api/reviews'),
        ]);
        const templatesData = await templatesRes.json();
        const reviewsData = await reviewsRes.json();

        if (templatesData.success && templatesData.data?.templates) {
          setTemplates(templatesData.data.templates);
        }
        if (reviewsData.success && reviewsData.data) {
          setTestimonials(reviewsData.data);
        }
      } catch {
      } finally {
        setTemplatesLoading(false);
        setTestimonialsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterLoading(true);
    setNewsletterMessage(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterMessage('Thanks for subscribing!');
        setNewsletterEmail('');
      } else {
        setNewsletterMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setNewsletterMessage('Something went wrong. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
            <div className="text-center">
              <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Write better AI prompts with an{' '}
                <span className="text-amber-400">intelligent prompt optimization</span> agent.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-200 sm:text-xl">
                PromptPilot AI analyzes your prompts, finds weaknesses, asks smart questions, and
                generates optimized versions for ChatGPT, Claude, Gemini, and more.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    Explore Templates
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              <div
                className={`rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all ${
                  beforeAfter ? 'opacity-40' : 'opacity-100'
                }`}
                onClick={() => setBeforeAfter(true)}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400">
                  Original
                </p>
                <p className="text-sm text-white/80">
                  Write a blog post about AI.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-red-300">Score: 35/100</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-1.5 w-[35%] rounded-full bg-red-400" />
                  </div>
                </div>
              </div>
              <div
                className={`rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all ${
                  beforeAfter ? 'opacity-100' : 'opacity-40'
                }`}
                onClick={() => setBeforeAfter(false)}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-400">
                  Optimized
                </p>
                <p className="text-sm text-white/80">
                  Write a comprehensive 1500-word blog post about the impact of AI on modern
                  healthcare, targeting healthcare professionals. Include specific examples of
                  diagnostic AI, treatment planning, and ethical considerations. Use a professional
                  but accessible tone.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-green-300">Score: 92/100</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-1.5 w-[92%] rounded-full bg-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Features Section */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Everything you need to craft perfect prompts
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Powerful tools to analyze, optimize, and manage your AI prompts.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. How It Works Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-slate-600">
                From raw prompt to optimized version in six simple steps.
              </p>
            </div>
            <div className="relative mt-12">
              <div className="absolute left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-slate-200 lg:block" />
              <div className="space-y-8 lg:space-y-12">
                {steps.map((step, i) => (
                  <div
                    key={step.number}
                    className={`relative flex items-center gap-8 ${
                      i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } flex-col lg:flex-row`}
                  >
                    <div className="flex-1">
                      <div
                        className={`rounded-xl border border-slate-200 bg-white p-6 ${
                          i % 2 === 0 ? 'lg:text-right' : ''
                        }`}
                      >
                        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                      </div>
                    </div>
                    <div className="z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white shadow-lg">
                      {step.number}
                    </div>
                    <div className="flex-1 hidden lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. AI Agent Workflow Section */}
        <section className="bg-slate-900 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                AI Agent Workflow Pipeline
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Multiple specialized AI agents work together to optimize your prompts.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              {agents.map((agent, i) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.name} className="flex items-center gap-4">
                    <div className="flex flex-col items-center rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-center transition-colors hover:border-primary-500">
                      <Icon className="mb-2 h-6 w-6 text-primary-400" />
                      <span className="text-sm font-medium text-white">{agent.name}</span>
                      <span className="text-xs text-slate-400">{agent.description}</span>
                    </div>
                    {i < agents.length - 1 && (
                      <ChevronRight className="hidden h-5 w-5 text-slate-600 sm:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Prompt Templates Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Popular Prompt Templates
                </h2>
                <p className="mt-2 text-lg text-slate-600">
                  Start with proven templates used by the community.
                </p>
              </div>
              <Link
                href="/explore"
                className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {templatesLoading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              ) : templates.length > 0 ? (
                templates.map((t: any) => <TemplateCard key={t.id} template={t} />)
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    icon={Layers}
                    title="No templates yet"
                    description="Templates will appear here as the community contributes them."
                    action={{ label: 'Explore', onClick: () => window.location.href = '/explore' }}
                  />
                </div>
              )}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/explore"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View All Templates <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Statistics Section */}
        <section className="bg-gradient-to-r from-primary-600 to-indigo-700 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {statsData.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <Icon className="mx-auto mb-3 h-8 w-8 text-indigo-200" />
                    <div className="text-3xl font-bold text-white sm:text-4xl">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-1 text-sm text-indigo-200">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Testimonials Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                What Our Users Say
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Join thousands of users who write better prompts with PromptPilot AI.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonialsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              ) : testimonials.length > 0 ? (
                testimonials.map((review: any) => (
                  <TestimonialCard key={review.id} review={review} />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    icon={MessageSquare}
                    title="No testimonials yet"
                    description="User stories will appear here after real feedback is submitted."
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Everything you need to know about PromptPilot AI.
              </p>
            </div>
            <div className="mt-12 space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-base font-medium text-slate-900">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-slate-100 px-6 py-4">
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Final CTA / Newsletter Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-indigo-700 py-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to write better prompts?
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Join thousands of users who are already creating optimized AI prompts with
              PromptPilot AI.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-amber-500 text-slate-900 hover:bg-amber-400"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="mb-4 text-sm text-indigo-200">
                Stay updated with tips and new features.
              </p>
              <form onSubmit={handleNewsletter} className="mx-auto flex max-w-md gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  isLoading={newsletterLoading}
                  className="bg-amber-500 text-slate-900 hover:bg-amber-400"
                >
                  Subscribe
                </Button>
              </form>
              {newsletterMessage && (
                <p className="mt-3 text-sm text-indigo-200">{newsletterMessage}</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
