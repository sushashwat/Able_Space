'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from '@/components/tasks/TaskCard';
import { getProjectById } from '@/lib/api/projects';
import { getTasks } from '@/lib/api/tasks';
import type { Project } from '@/lib/types/project';
import type { Task } from '@/lib/types/tasks';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjectById(id), getTasks({ projectId: id, limit: 100 })])
      .then(([projectData, tasksData]) => {
        setProject(projectData);
        setTasks(tasksData.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;
  if (!project) return <div className="p-8 text-sm text-gray-500">Project not found.</div>;

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 text-gray-500" />
        </button>
        <span className="text-sm text-gray-500">Projects</span>
      </div>

      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900">{project.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{project.description}</p>

        <div className="mt-3 flex gap-2">
          <Badge variant="secondary">{project.status}</Badge>
          <Badge variant="secondary">{project.priority}</Badge>
        </div>

        <h3 className="mt-6 mb-3 text-sm font-medium text-gray-700">
          Tasks ({tasks.length})
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => router.push(`/tasks/${task._id}`)}
            />
          ))}
        </div>
        {tasks.length === 0 && (
          <p className="text-sm text-gray-400">No tasks linked to this project yet.</p>
        )}
      </div>
    </div>
  );
}