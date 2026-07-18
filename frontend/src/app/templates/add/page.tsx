'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from '@/components/ui/Toast';
import { TemplateCard } from '@/components/cards/TemplateCard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';
import { createTemplate } from '@/services/api/templates';
import type { Template, CreateTemplatePayload } from '@/types/template.types';

const CATEGORY_OPTIONS = [
  { value: 'writing', label: 'Writing' },
  { value: 'coding', label: 'Coding' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'creative', label: 'Creative' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'other', label: 'Other' },
];

const MODEL_OPTIONS = [
  { value: 'ChatGPT', label: 'ChatGPT' },
  { value: 'Claude', label: 'Claude' },
  { value: 'Gemini', label: 'Gemini' },
  { value: 'Llama', label: 'Llama' },
  { value: 'Other', label: 'Other' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const TONE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'Professional', label: 'Professional' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Creative', label: 'Creative' },
  { value: 'Persuasive', label: 'Persuasive' },
  { value: 'Technical', label: 'Technical' },
];

const OUTPUT_TYPE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'Text', label: 'Text' },
  { value: 'Code', label: 'Code' },
  { value: 'JSON', label: 'JSON' },
  { value: 'Markdown', label: 'Markdown' },
  { value: 'HTML', label: 'HTML' },
  { value: 'List', label: 'List' },
  { value: 'Table', label: 'Table' },
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

const defaultForm = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  promptContent: '',
  category: '',
  targetModel: '',
  difficulty: '',
  tone: '',
  outputType: '',
  tags: '',
  imageUrl: '',
  visibility: 'public' as const,
};

export default function AddTemplatePage() {
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useCurrentUser();
  const [form, setForm] = useState({ ...defaultForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const previewTemplate: Template = {
    id: 'preview',
    title: form.title || 'Template Title',
    shortDescription: form.shortDescription || 'Short description will appear here...',
    fullDescription: form.fullDescription,
    promptContent: form.promptContent || 'Your prompt content will appear here...',
    category: form.category || 'other',
    targetModel: form.targetModel || '',
    difficulty: form.difficulty || 'Beginner',
    tone: form.tone || undefined,
    outputType: form.outputType || undefined,
    tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    imageUrl: form.imageUrl || undefined,
    visibility: form.visibility as 'public' | 'private',
    usageCount: 0,
    averageRating: 0,
    userId: user?.id || '',
    authorName: user?.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!form.promptContent.trim()) newErrors.promptContent = 'Prompt content is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.targetModel) newErrors.targetModel = 'Target model is required';
    if (!form.difficulty) newErrors.difficulty = 'Difficulty is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateTemplatePayload = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim() || undefined,
        promptContent: form.promptContent,
        category: form.category,
        targetModel: form.targetModel,
        difficulty: form.difficulty,
        tone: form.tone || undefined,
        outputType: form.outputType || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        imageUrl: form.imageUrl || undefined,
        visibility: form.visibility as 'public' | 'private',
      };

      const result = await createTemplate(payload);
      if (result.success) {
        toast('Template created successfully!', 'success');
        router.push('/templates/manage');
      } else {
        toast(result.error || 'Failed to create template', 'error');
      }
    } catch {
      toast('An unexpected error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ ...defaultForm });
    setErrors({});
  };

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create Template</h1>
        <p className="mt-1 text-sm text-slate-500">
          Share your prompt templates with the community.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Button
          variant={showPreview ? 'secondary' : 'primary'}
          onClick={() => setShowPreview(false)}
        >
          <EyeOff className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant={showPreview ? 'primary' : 'secondary'}
          onClick={() => setShowPreview(true)}
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>

      {showPreview ? (
        <div className="mx-auto max-w-sm">
          <TemplateCard template={previewTemplate} onView={() => {}} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Basic Information</h2>
            <div className="space-y-4">
              <Input
                label="Title *"
                placeholder="e.g., Code Review Prompt"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
              />
              <Textarea
                label="Short Description *"
                placeholder="Brief description (1-2 sentences)"
                value={form.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                error={errors.shortDescription}
                rows={2}
              />
              <Textarea
                label="Full Description"
                placeholder="Detailed description of what this template does..."
                value={form.fullDescription}
                onChange={(e) => handleChange('fullDescription', e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Classification</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label="Category *"
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Select category"
                error={errors.category}
              />
              <Select
                label="Target AI Model *"
                options={MODEL_OPTIONS}
                value={form.targetModel}
                onChange={(e) => handleChange('targetModel', e.target.value)}
                placeholder="Select model"
                error={errors.targetModel}
              />
              <Select
                label="Difficulty *"
                options={DIFFICULTY_OPTIONS}
                value={form.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                placeholder="Select difficulty"
                error={errors.difficulty}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Prompt Content</h2>
            <Textarea
              label="Prompt Template Content *"
              placeholder="Write your prompt template here. Use {{placeholders}} for variables..."
              value={form.promptContent}
              onChange={(e) => handleChange('promptContent', e.target.value)}
              error={errors.promptContent}
              rows={10}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Additional Settings</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Tone"
                options={TONE_OPTIONS}
                value={form.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
              />
              <Select
                label="Output Type"
                options={OUTPUT_TYPE_OPTIONS}
                value={form.outputType}
                onChange={(e) => handleChange('outputType', e.target.value)}
              />
              <Input
                label="Tags"
                placeholder="Comma-separated tags"
                value={form.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                helperText="e.g., code-review, best-practices"
              />
              <Input
                label="Image URL"
                placeholder="https://example.com/image.png"
                value={form.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
              />
              <Select
                label="Visibility"
                options={VISIBILITY_OPTIONS}
                value={form.visibility}
                onChange={(e) => handleChange('visibility', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              <Save className="h-4 w-4" />
              Create Template
            </Button>
          </div>
        </form>
      )}
    </div>
    </ProtectedRoute>
  );
}