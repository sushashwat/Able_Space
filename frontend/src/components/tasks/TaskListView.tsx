'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Task, TaskStatus } from '@/lib/types/tasks';
import { format } from 'date-fns';

const statuses: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

const priorityColor: Record<string, string> = {
  Urgent: 'text-red-600 dark:text-red-400',
  High: 'text-orange-500 dark:text-orange-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  Low: 'text-muted-foreground',
  'No Priority': 'text-muted-foreground',
};

interface TaskListViewProps {
  tasks: Task[];
  visibleFields: Record<string, boolean>;
  onTaskClick: (id: string) => void;
}

export function TaskListView({ tasks, visibleFields, onTaskClick }: TaskListViewProps) {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {statuses.map((status) => {
        const rows = tasks.filter((t) => t.status === status);
        if (rows.length === 0) return null;

        return (
          <div key={status}>
            <p className="text-sm font-medium text-foreground mb-2">{status}</p>
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b bg-muted text-left text-muted-foreground">
                  <th className="py-2 px-3 font-medium">Task</th>
                  {visibleFields.priority && <th className="py-2 px-3 font-medium">Priority</th>}
                  {visibleFields.members && <th className="py-2 px-3 font-medium">Members</th>}
                  {visibleFields.dueDate && <th className="py-2 px-3 font-medium">Due Date</th>}
                  {visibleFields.labels && <th className="py-2 px-3 font-medium">Labels</th>}
                  {visibleFields.status && <th className="py-2 px-3 font-medium">Status</th>}
                  {visibleFields.reporter && <th className="py-2 px-3 font-medium">Reporter</th>}
                  <th className="py-2 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => onTaskClick(task._id)}
                    className="cursor-pointer border-b last:border-0 hover:bg-accent"
                  >
                    <td className="py-2 px-3 font-medium text-foreground">{task.title}</td>
                    {visibleFields.priority && (
                      <td className="py-2 px-3">
                        <span className={priorityColor[task.priority]}>{task.priority}</span>
                      </td>
                    )}
                    {visibleFields.members && (
                      <td className="py-2 px-3">
                        {task.members.length > 0 ? (
                          <Avatar className="h-6 w-6">
                            
                            <AvatarFallback className="text-xs">
                              {task.members.length > 1 ? `+${task.members.length}` : 'U'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          '—'
                        )}
                      </td>
                    )}
                    {visibleFields.dueDate && (
                      <td className="py-2 px-3 text-muted-foreground">
                        {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : '—'}
                      </td>
                    )}
                    {visibleFields.labels && (
                      <td className="py-2 px-3">
                        <div className="flex gap-1 flex-wrap">
                          {task.labels.slice(0, 2).map((l) => (
                            <Badge key={l} variant="secondary" className="text-xs">
                              {l}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    )}
                    {visibleFields.status && (
                      <td className="py-2 px-3">
                        <Badge variant="secondary">{task.status}</Badge>
                      </td>
                    )}
                    {visibleFields.reporter && (
                      <td className="py-2 px-3 text-muted-foreground">
                        {task.reporter ? task.reporter.slice(-4) : '—'}
                      </td>
                    )}
                    <td className="py-2 px-3 text-muted-foreground">•••</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {tasks.length === 0 && (
        <p className="text-sm text-muted-foreground">No tasks yet.</p>
      )}
    </div>
  );
}