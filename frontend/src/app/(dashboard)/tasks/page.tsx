'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getProfile } from '@/lib/api/auth';

export default function TasksPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      getProfile()
        .then(setUser)
        .finally(() => setLoading(false));
    }
  }, [user, setUser]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Welcome, {user?.fullName}!</h1>
      <p className="text-gray-500 mt-2">Tasks page — coming soon 🚧</p>
    </div>
  );
}