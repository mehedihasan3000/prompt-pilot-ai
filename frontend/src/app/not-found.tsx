import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50">
            <FileQuestion className="h-10 w-10 text-primary-600" />
          </div>
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h2>
        <p className="mt-2 text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
