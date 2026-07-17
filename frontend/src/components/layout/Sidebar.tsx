'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PenSquare,
  History,
  FolderOpen,
  BarChart3,
  Bot,
  LayoutTemplate,
  PlusCircle,
  User,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workspace', label: 'Workspace', icon: PenSquare },
  { href: '/history', label: 'History', icon: History },
  { href: '/collections', label: 'Collections', icon: FolderOpen },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/assistant', label: 'Assistant', icon: Bot },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/templates/create', label: 'Add Template', icon: PlusCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Sidebar({ userName, userEmail, userImage }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-20 lg:pt-16">
      <div className="flex flex-col flex-1 border-r border-slate-200 bg-white">
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            {userImage ? (
              <img
                src={userImage}
                alt={userName || 'User'}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {(userName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {userName || 'User'}
              </p>
              <p className="truncate text-xs text-slate-500">
                {userEmail || ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
