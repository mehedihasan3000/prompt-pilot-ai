'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Lightbulb, Cpu, BookOpen, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const articles = [
  {
    id: 'tips-better-prompts',
    icon: Lightbulb,
    title: '10 Tips for Writing Better AI Prompts',
    excerpt:
      'Master the art of prompt engineering with these ten proven techniques that will dramatically improve the quality of responses from ChatGPT, Claude, Gemini, and other AI models.',
    date: 'March 15, 2026',
    readTime: '8 min read',
    tags: ['Prompt Engineering', 'Best Practices'],
  },
  {
    id: 'choose-right-ai-model',
    icon: Cpu,
    title: 'How to Choose the Right AI Model for Your Task',
    excerpt:
      'Not all AI models are created equal. Learn how to match your specific use case with the right model to get optimal results every time.',
    date: 'March 8, 2026',
    readTime: '6 min read',
    tags: ['AI Models', 'Comparison'],
  },
  {
    id: 'few-shot-prompting',
    icon: BookOpen,
    title: 'The Art of Few-Shot Prompting',
    excerpt:
      'Few-shot prompting is one of the most powerful techniques in prompt engineering. Discover how to craft effective examples that guide AI models to produce exactly what you need.',
    date: 'February 28, 2026',
    readTime: '7 min read',
    tags: ['Techniques', 'Advanced'],
  },
  {
    id: 'common-mistakes',
    icon: AlertTriangle,
    title: 'Common Prompting Mistakes and How to Fix Them',
    excerpt:
      'Even experienced prompt engineers make mistakes. Identify the most common pitfalls in prompt writing and learn practical strategies to avoid them.',
    date: 'February 20, 2026',
    readTime: '5 min read',
    tags: ['Troubleshooting', 'Beginner'],
  },
];

const tagColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  'Prompt Engineering': 'default',
  'Best Practices': 'success',
  'AI Models': 'warning',
  'Comparison': 'default',
  'Techniques': 'success',
  'Advanced': 'warning',
  'Troubleshooting': 'danger',
  'Beginner': 'default',
};

export default function BlogPage() {
  useEffect(() => {
    document.title = 'Blog | PromptPilot AI';
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Prompt Engineering Blog
            </h1>
            <p className="mt-4 text-lg text-indigo-200">
              Tips, guides, and best practices for writing better AI prompts.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {articles.map((article) => {
            const Icon = article.icon;
            return (
              <article
                key={article.id}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white transition-all hover:border-primary-200 hover:shadow-md"
              >
                <div className="p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant={tagColors[tag] || 'default'}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link href={`/blog/${article.id}`}>
                    <h2 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-primary-600">
                      {article.title}
                    </h2>
                  </Link>

                  <p className="mb-4 text-sm text-slate-600 leading-relaxed">{article.excerpt}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {article.date}
                      </span>
                      <span>{article.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${article.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                    >
                      Read More
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
