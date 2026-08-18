'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getTasks, createTask } from '@/lib/api/tasks';
import type { Task } from '@/lib/types/tasks';
import { format } from 'date-fns';

const priorityColor: Record<string, string> = {
  Urgent: 'text-red-600 dark:text-red-400',
  High: 'text-orange-500 dark:text-orange-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  Low: 'text-muted-foreground',
  'No Priority': 'text-muted-foreground',
};

export function SubtasksTable({ parentTaskId }: { parentTaskId: string }) {
  const router = useRouter();
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    loadSubtasks();
  }, [parentTaskId]);

  function loadSubtasks() {
    getTasks({ parentTask: parentTaskId, limit: 100 }).then((res) => setSubtasks(res.data));
  }

  async function handleAdd() {
    if (!newTitle.trim()) return;
    await createTask({ title: newTitle, parentTask: parentTaskId, status: 'To Do' });
    setNewTitle('');
    setAdding(false);
    loadSubtasks();
  }

  return (
    <div>
      {subtasks.length > 0 && (
        <table className="w-full text-sm border rounded-lg overflow-hidden mb-2">
          <thead>
            <tr className="border-b bg-muted text-left text-muted-foreground">
              <th className="py-2 px-3 font-medium">Task</th>
              <th className="py-2 px-3 font-medium">Priority</th>
              <th className="py-2 px-3 font-medium">Due Date</th>
              <th className="py-2 px-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subtasks.map((st) => (
              <tr
                key={st._id}
                onClick={() => router.push(`/tasks/${st._id}`)}
                className="cursor-pointer border-b last:border-0 hover:bg-accent"
              >
                <td className="py-2 px-3 text-foreground">{st.title}</td>
                <td className="py-2 px-3">
                  <span className={priorityColor[st.priority]}>{st.priority}</span>
                </td>
                <td className="py-2 px-3 text-muted-foreground">
                  {st.dueDate ? format(new Date(st.dueDate), 'dd MMM yyyy') : '—'}
                </td>
                <td className="py-2 px-3 text-muted-foreground">•••</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {adding ? (
        <div className="flex gap-2">
          <Input
            autoFocus
            placeholder="Subtask title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="text-sm text-primary">
            Add
          </button>
          <button onClick={() => setAdding(false)} className="text-sm text-muted-foreground">
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" /> Add Subtasks
        </button>
      )}
    </div>
  );
}