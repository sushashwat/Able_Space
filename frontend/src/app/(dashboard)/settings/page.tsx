'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';
import { apiClient } from '@/lib/api/client';
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

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, colorMode, setTheme, setColorMode } = useThemeStore();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [title, setTitle] = useState((user as any)?.title ?? '');
  const [username, setUsername] = useState((user as any)?.username ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const { data } = await apiClient.patch('/users/me', {
        fullName,
        title,
        username,
      });
      setUser(data);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6 max-w-2xl">
      <h1 className="text-lg font-semibold mb-6">Settings</h1>

      {/* Profile section */}
      <div className="rounded-lg border p-6 mb-6">
        <h2 className="text-sm font-semibold mb-4">Profile</h2>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Profile picture</span>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>
              {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Email</span>
          <span className="text-sm text-gray-800">{user?.email}</span>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">Full name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">Title</label>
          <Input
            placeholder="Your job title or role"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">Username</label>
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

      {/* Theme section */}
      <div className="rounded-lg border p-6 mb-6">
        <h2 className="text-sm font-semibold mb-4">Theme</h2>
        <div className="flex gap-3">
          {(['light', 'dark'] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 rounded-md border py-2 text-sm font-medium capitalize ${
                theme === t ? 'border-black bg-gray-50' : 'border-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Color section */}
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
                  colorMode === c ? 'border-black' : 'border-transparent'
                }`}
                style={{ backgroundColor: colorSwatch(c) }}
              />
              <span className="text-xs text-gray-500 capitalize">{c}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}