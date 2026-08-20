'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';
import { apiClient } from '@/lib/api/client';
import { getProfile } from '@/lib/api/auth';
import { getAvatarUrl } from '@/lib/utils';
import type { Theme, ColorMode } from '@/lib/types/user';

const colorModes: ColorMode[] = ['amber', 'blue', 'pink', 'rose', 'emerald', 'black'];

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

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'theme', label: 'Theme' },
  { id: 'color', label: 'Color' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const { theme, colorMode, setTheme, setColorMode } = useThemeStore();

  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((freshUser) => setUser(freshUser))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? '');
      setTitle((user as any).title ?? '');
      setUsername((user as any).username ?? '');
    }
  }, [user]);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const { data } = await apiClient.patch('/users/me', { fullName, title, username });
      setUser(data);
    } finally {
      setSaving(false);
    }
  }

  function handleLeaveWorkspace() {
    setLeaving(true);
    logout();
    router.push('/login');
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-lg font-semibold mb-6">Settings</h1>

      <div className="flex gap-6 max-w-4xl">
        <div className="w-48 shrink-0 space-y-1">
          <button
            onClick={() => router.push('/tasks')}
            className="text-xs text-muted-foreground hover:text-foreground mb-3 block"
          >
            ← Back to app
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <>
              <div className="rounded-lg border p-6">
                <h2 className="text-sm font-semibold mb-4">Profile</h2>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Profile picture</span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatarUrl || getAvatarUrl(user?.id ?? 'guest')} />
                    <AvatarFallback>
                      {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm text-foreground">{user?.email}</span>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-muted-foreground block mb-1">Full name</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-muted-foreground block mb-1">Title</label>
                  <Input
                    placeholder="Your job title or role"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-muted-foreground block mb-1">Username</label>
                  <Input
                    placeholder="One word, like a nickname or first name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>

              <div className="rounded-lg border p-6">
                <h2 className="text-sm font-semibold mb-4">Workspace access</h2>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Remove yourself from the workspace
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLeaveWorkspace}
                    disabled={leaving}
                  >
                    {leaving ? 'Leaving...' : 'Leave Workspace'}
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'theme' && (
            <div className="rounded-lg border p-6">
              <h2 className="text-sm font-semibold mb-4">Theme</h2>
              <div className="flex gap-3">
                {(['light', 'dark'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 rounded-md border py-2 text-sm font-medium capitalize ${
                      theme === t ? 'border-foreground bg-muted' : 'border-border'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div className="rounded-lg border p-6">
              <h2 className="text-sm font-semibold mb-4">Color</h2>
              <div className="flex gap-3 flex-wrap">
                {colorModes.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorMode(c)}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={`h-8 w-8 rounded-full border-2 ${
                        colorMode === c ? 'border-foreground' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: colorSwatch(c) }}
                    />
                    <span className="text-xs text-muted-foreground capitalize">{c}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}