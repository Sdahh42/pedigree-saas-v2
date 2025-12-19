'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Dog,
  LayoutDashboard,
  Heart,
  GitBranch,
  Dna,
  Users,
  DollarSign,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chiens', href: '/dashboard/dogs', icon: Dog },
  { name: 'Reproduction', href: '/dashboard/reproduction', icon: Heart },
  { name: 'Pedigrees', href: '/dashboard/pedigrees', icon: GitBranch },
  { name: 'Génétique', href: '/dashboard/genetics', icon: Dna },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Finances', href: '/dashboard/finances', icon: DollarSign },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Dog className="h-6 w-6 text-primary" />
            <span>PedigreeApp</span>
          </Link>
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Plan info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Plan FREE</span>
              <Link href="/dashboard/settings/billing" className="text-xs text-primary hover:underline">
                Upgrade
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">
              3/10 chiens utilisés
            </div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '30%' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center justify-between px-4">
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="p-2 hover:bg-muted rounded-md relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </button>

            {/* User menu */}
            <div className="flex items-center gap-2 pl-2 border-l">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">JD</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Jean Dupont</p>
                <p className="text-xs text-muted-foreground">Mon élevage</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
