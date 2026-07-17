import type { Metadata } from 'next';
import { Shield, Database, Lock, Brain, Clock, Cookie, Share2, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

const sections = [
  {
    icon: Shield,
    title: 'Information We Collect',
    content:
      'When you create an account with PromptPilot AI, we collect your name, email address, and a hashed password. You may optionally provide a profile image and bio. We also collect analytics data related to your prompt usage, including prompt scores, categories, and AI model selections, to improve our service and provide you with personalized insights.',
  },
  {
    icon: Lock,
    title: 'Prompt Privacy',
    content:
      'Your prompts are private to you. We do not share, sell, or publicly display the prompts you submit for analysis. Prompts are processed in real time to generate scores, optimization suggestions, and variants. After processing, prompt content is stored securely in your account and is only accessible by you. We do not use your prompts to train or fine-tune any third-party AI models without your explicit consent.',
  },
  {
    icon: Brain,
    title: 'AI Provider Usage',
    content:
      'PromptPilot AI integrates with third-party AI providers including Google Gemini and Groq to analyze and optimize your prompts. When you submit a prompt, it is sent to these providers for processing. These providers do not retain your data beyond the processing request unless otherwise stated in their own policies. We select providers that commit to not using customer data for model training.',
  },
  {
    icon: Database,
    title: 'How Your Data Is Stored',
    content:
      'Your account data and prompt history are stored on secure servers with encryption at rest and in transit. We use industry-standard security measures, including TLS encryption for data transmission and AES-256 encryption for stored data. Access to production databases is restricted to authorized personnel only and is audited regularly.',
  },
  {
    icon: Clock,
    title: 'Account Data Retention',
    content:
      'We retain your account data for as long as your account remains active. If you delete your account, all associated data — including prompts, templates, collections, and analytics — are permanently removed from our systems within 30 days. Backup copies may persist for up to 90 days before being fully purged. You can request data export at any time by contacting our support team.',
  },
  {
    icon: Cookie,
    title: 'Cookie Usage',
    content:
      'We use essential cookies to maintain your session and keep you logged in. These cookies are necessary for the basic functionality of the application. We also use optional analytics cookies to understand how you interact with the platform, which helps us improve the user experience. You can control cookie preferences through your browser settings at any time.',
  },
  {
    icon: Share2,
    title: 'Third-Party Services',
    content:
      'PromptPilot AI uses the following third-party services: Google Authentication for sign-in, Google Gemini and Groq for AI prompt analysis, and Vercel for hosting and analytics. Each of these providers operates under their own privacy policies. We only share the minimum data necessary for each service to function. We do not sell your personal information to any third party.',
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or delete your personal data at any time. You can export your data from your account settings or by contacting us. You may also request restrictions on how your data is processed. To exercise any of these rights, please reach out to privacy@promptpilot.ai. We will respond to your request within 30 days as required by applicable regulations.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: July 1, 2026</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-sm sm:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <section.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-center sm:p-8">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Contact Us</h2>
          <p className="text-sm text-slate-600">
            If you have questions about this privacy policy, please email us at{' '}
            <a href="mailto:privacy@promptpilot.ai" className="font-medium text-primary-600 hover:text-primary-500">
              privacy@promptpilot.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
