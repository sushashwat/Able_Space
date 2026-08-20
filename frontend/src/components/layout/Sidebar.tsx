// frontend/src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, FolderKanban, ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';
import type { Theme, ColorMode } from '@/lib/types/user';
import {getAvatarUrl} from '@/lib/utils';

const navItems = [
  { label: 'Tasks', href: '/tasks', icon: LayoutGrid },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
];

const colorModes: ColorMode[] = ['amber', 'blue', 'pink', 'rose', 'emerald', 'black'];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, colorMode, setTheme, setColorMode } = useThemeStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      {/* User switcher */}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-accent">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.avatarUrl || getAvatarUrl(user?.id ?? 'guest')} />
              <AvatarFallback>
                {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm font-medium">
              {user?.fullName ?? 'Guest'}
            </span>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Theme</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {(['light', 'dark'] as Theme[]).map((t) => (
                  <DropdownMenuItem key={t} onClick={() => setTheme(t)}>
                    {t === 'light' ? 'Light' : 'Dark'}
                    {theme === t && ' ✓'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Color Mode</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {colorModes.map((c) => (
                  <DropdownMenuItem key={c} onClick={() => setColorMode(c)}>
                    <span
                      className="mr-2 inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: colorSwatch(c) }}
                    />
                    {capitalize(c)}
                    {colorMode === c && ' ✓'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push('/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Workspace</p>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function colorSwatch(c: ColorMode) {
  const map: Record<ColorMode, string> = {
    amber: '#f59e0b',
    blue: '#3b82f6',
    pink: '#ec4899',
    rose: '#f43f5e',
    emerald: '#10b981',
    black: '#000000',
  };
  return map[c];
}