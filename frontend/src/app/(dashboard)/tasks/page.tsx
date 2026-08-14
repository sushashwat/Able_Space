'use client';

import { useRouter } from 'next/navigation';
import { TaskBoard } from '@/components/tasks/TaskBoard';

export default function TasksPage() {
  const router = useRouter();

  return (
    <div className="h-full">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Tasks</h1>
      </div>
      <TaskBoard onTaskClick={(id) => router.push(`/tasks/${id}`)} />
    </div>
  );
}