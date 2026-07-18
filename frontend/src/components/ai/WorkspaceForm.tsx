'use client';

import { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { AnalyzeInput } from '@/services/api/ai';

interface WorkspaceFormProps {
  onSubmit: (data: AnalyzeInput) => void;
  isLoading: boolean;
}

const modelOptions = [
  { value: 'ChatGPT', label: 'ChatGPT' },
  { value: 'Claude', label: 'Claude' },
  { value: 'Gemini', label: 'Gemini' },
  { value: 'Groq', label: 'Groq' },
  { value: 'Other', label: 'Other' },
];

const toneOptions = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Friendly', label: 'Friendly' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Creative', label: 'Creative' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Humorous', label: 'Humorous' },
  { value: 'Formal', label: 'Formal' },
  { value: 'Persuasive', label: 'Persuasive' },
  { value: 'Empathetic', label: 'Empathetic' },
];

const lengthOptions = [
  { value: 'Short', label: 'Short' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Long', label: 'Long' },
  { value: 'Very Long', label: 'Very Long' },
];

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Russian', label: 'Russian' },
];

const formatOptions = [
  { value: 'Text', label: 'Text' },
  { value: 'Markdown', label: 'Markdown' },
  { value: 'JSON', label: 'JSON' },
  { value: 'HTML', label: 'HTML' },
  { value: 'Code', label: 'Code' },
  { value: 'List', label: 'List' },
  { value: 'Table', label: 'Table' },
  { value: 'Essay', label: 'Essay' },
  { value: 'Email', label: 'Email' },
  { value: 'Blog Post', label: 'Blog Post' },
];

const categoryOptions = [
  { value: '', label: 'None' },
  { value: 'Coding', label: 'Coding' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Research', label: 'Research' },
  { value: 'Email', label: 'Email' },
  { value: 'Blog', label: 'Blog' },
  { value: 'Business', label: 'Business' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Image Generation', label: 'Image Generation' },
  { value: 'Other', label: 'Other' },
];

const creativityOptions = Array.from({ length: 10 }, (_, i) => ({
  value: String((i + 1) / 10),
  label: String((i + 1) / 10),
}));

interface FormErrors {
  [key: string]: string;
}

export function WorkspaceForm({ onSubmit, isLoading }: WorkspaceFormProps) {
  const [title, setTitle] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [goal, setGoal] = useState('');
  const [targetModel, setTargetModel] = useState('ChatGPT');
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [outputLength, setOutputLength] = useState('Medium');
  const [outputFormat, setOutputFormat] = useState('Text');
  const [audience, setAudience] = useState('');
  const [category, setCategory] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [constraints, setConstraints] = useState('');
  const [examples, setExamples] = useState('');
  const [creativityLevel, setCreativityLevel] = useState('0.7');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!originalPrompt.trim()) newErrors.originalPrompt = 'Original prompt is required';
    if (!goal.trim()) newErrors.goal = 'Goal is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: AnalyzeInput = {
      title: title.trim(),
      originalPrompt: originalPrompt.trim(),
      goal: goal.trim(),
      targetModel,
      tone,
      language,
      outputLength,
      outputFormat,
      audience: audience.trim() || undefined,
      category: category || undefined,
      extraContext: extraContext.trim() || undefined,
      constraints: constraints.trim() || undefined,
      examples: examples.trim() || undefined,
      creativityLevel: parseFloat(creativityLevel),
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
        <Textarea
          label="Prompt Title *"
          placeholder="e.g., Blog post about AI in healthcare"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          rows={1}
        />
        <Textarea
          label="Original Prompt *"
          placeholder="Paste your original prompt here..."
          value={originalPrompt}
          onChange={(e) => setOriginalPrompt(e.target.value)}
          error={errors.originalPrompt}
          rows={6}
        />
        <Textarea
          label="Goal *"
          placeholder="What do you want the AI to achieve with this prompt?"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          error={errors.goal}
          rows={2}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Prompt Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Target AI Model"
            options={modelOptions}
            value={targetModel}
            onChange={(e) => setTargetModel(e.target.value)}
          />
          <Select
            label="Tone"
            options={toneOptions}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
          <Select
            label="Output Length"
            options={lengthOptions}
            value={outputLength}
            onChange={(e) => setOutputLength(e.target.value)}
          />
          <Select
            label="Language"
            options={languageOptions}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <Select
            label="Output Format"
            options={formatOptions}
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          />
          <Select
            label="Creativity Level"
            options={creativityOptions}
            value={creativityLevel}
            onChange={(e) => setCreativityLevel(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:bg-slate-50"
        >
          <span className="text-sm font-semibold text-slate-900">Advanced Options</span>
          {advancedOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>
        {advancedOpen && (
          <div className="space-y-4">
            <Textarea
              label="Audience"
              placeholder="Who is this prompt for?"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              rows={2}
            />
            <Select
              label="Category"
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Textarea
              label="Extra Context"
              placeholder="Any additional context the AI should know"
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value)}
              rows={3}
            />
            <Textarea
              label="Constraints"
              placeholder="Any limitations or constraints"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              rows={3}
            />
            <Textarea
              label="Examples"
              placeholder="Provide examples of desired output"
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
              rows={3}
            />
            <Input
              label="Tags"
              placeholder="e.g., blog, healthcare, AI (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        )}
      </div>

      <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
        <Send className="h-4 w-4" />
        {isLoading ? 'Analyzing...' : 'Analyze Prompt'}
      </Button>
    </form>
  );
}
