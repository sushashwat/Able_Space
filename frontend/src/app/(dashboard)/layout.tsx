'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useThemeStore } from '@/lib/store/themeStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const applyToDOM = useThemeStore((s) => s.applyToDOM);

  useEffect(() => {
    applyToDOM();
  }, [applyToDOM]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}