'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getProfile } from '@/lib/api/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.push('/login');
      return;
    }

    setToken(token);

    getProfile()
      .then((user) => {
        setUser(user);
        router.push('/tasks');
      })
      .catch(() => {
        router.push('/login');
      });
  }, [searchParams, router, setToken, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Logging you in...</p>
    </div>
  );
}