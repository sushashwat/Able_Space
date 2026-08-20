'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/tasks/TaskCard';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
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
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  function loadData() {
    setLoading(true);
    Promise.all([getProjectById(id), getTasks({ projectId: id, limit: 100 })])
      .then(([projectData, tasksData]) => {
        setProject(projectData);
        setTasks(tasksData.data);
      })
      .finally(() => setLoading(false));
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading...</div>;
  if (!project) return <div className="p-8 text-sm text-muted-foreground">Project not found.</div>;

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="text-sm text-muted-foreground">Projects</span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{project.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>

            <div className="mt-3 flex gap-2">
              <Badge variant="secondary">{project.status}</Badge>
              <Badge variant="secondary">{project.priority}</Badge>
            </div>
          </div>

          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>

        <h3 className="mt-6 mb-3 text-sm font-medium text-foreground">
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
          <p className="text-sm text-muted-foreground">No tasks linked to this project yet.</p>
        )}
      </div>

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultStatus="To Do"
        defaultProject={project._id}
        onCreated={loadData}
      />
    </div>
  );
}