'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/lib/types/tasks';
import { format } from 'date-fns';
import { getAvatarUrl } from '@/lib/utils';
const priorityColor: Record<string, string> = {
  Urgent: 'text-red-600',
  High: 'text-orange-500',
  Medium: 'text-yellow-600',
  Low: 'text-muted-foreground',
  'No Priority': 'text-gray-300',
};

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="text-sm font-medium text-foreground mb-2">{task.title}</p>

      <div className="flex flex-wrap gap-1 mb-2">
        {task.labels.slice(0, 2).map((label) => (
          <Badge key={label} variant="secondary" className="text-xs">
            {label}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.members.length > 0 && (
            <Avatar className="h-5 w-5">
              <AvatarImage src={getAvatarUrl(task.members[0] ?? task._id)} />
              <AvatarFallback className="text-xs">
                {task.members.length > 1 ? `+${task.members.length}` : 'U'}
              </AvatarFallback>
            </Avatar>
          )}
          {task.priority !== 'No Priority' && (
            <span className={`text-xs font-medium ${priorityColor[task.priority]}`}>
              {task.priority}
            </span>
          )}
        </div>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            {format(new Date(task.dueDate), 'dd MMM')}
          </span>
        )}
      </div>
    </div>
  );
}