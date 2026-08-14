'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTaskById, updateTask } from '@/lib/api/tasks';
import type { Task, TaskStatus, Priority } from '@/lib/types/tasks';

const statuses: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];
const priorities: Priority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadTask();
  }, [id]);

  async function loadTask() {
    setLoading(true);
    try {
      const data = await getTaskById(id);
      setTask(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(value: string | null) {
    if (!task || !value) return;
    const updated = await updateTask(task._id, { status: value as TaskStatus });
    setTask(updated);
  }

  async function handlePriorityChange(value: string | null) {
    if (!task || !value) return;
    const updated = await updateTask(task._id, { priority: value as Priority });
    setTask(updated);
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading...</div>;
  if (!task) return <div className="p-8 text-sm text-muted-foreground">Task not found.</div>;

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="text-sm text-muted-foreground">Tasks</span>
      </div>

      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Main content */}
        <div className="col-span-2 space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{task.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
          </div>

          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.labels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Comments ({task.comments.length})
            </h3>
            <div className="space-y-3 mb-4">
              {task.comments.map((c, i) => (
                <div key={i} className="rounded-md bg-muted p-3">
                  <p className="text-sm text-foreground">{c.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(c.createdAt), 'dd MMM, HH:mm')}
                  </p>
                </div>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full rounded-md border p-2 text-sm bg-background"
              rows={2}
            />
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-foreground">Details</h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Priority</p>
              <Select value={task.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Due Date</p>
              <p className="text-foreground">
                {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : '—'}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Members</p>
              <p className="text-foreground">{task.members.length} assigned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}