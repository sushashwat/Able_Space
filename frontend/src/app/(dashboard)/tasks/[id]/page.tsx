'use client';

import { useEffect, useState, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MembersPicker } from '@/components/tasks/MemberPicker';
import { SubtasksTable } from '@/components/tasks/SubtasksTable';
import { getTaskById, updateTask, addComment } from '@/lib/api/tasks';
import { getAllUsers } from '@/lib/api/users';
import { getAvatarUrl } from '@/lib/utils';
import type { Task, TaskStatus, Priority } from '@/lib/types/tasks';
import type { UserSummary } from '@/lib/types/user';

const statuses: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];
const priorities: Priority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newResource, setNewResource] = useState('');
  const [newTeam, setNewTeam] = useState('');

  const userMap = new Map(users.map((u) => [u._id, u]));

  const loadTask = useCallback(async () => {
    setLoading(true);
    try {
      const [taskData, usersData] = await Promise.all([getTaskById(id), getAllUsers()]);
      setTask(taskData);
      setUsers(usersData);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  async function patchTask(payload: any) {
    if (!task) return;
    const updated = await updateTask(task._id, payload);
    setTask(updated);
  }

  async function handleStatusChange(value: string | null) {
    if (!value) return;
    await patchTask({ status: value as TaskStatus });
  }

  async function handlePriorityChange(value: string | null) {
    if (!value) return;
    await patchTask({ priority: value as Priority });
  }

  async function handleMembersChange(ids: string[]) {
    await patchTask({ members: ids });
  }

  async function handleAddLabel() {
    if (!newLabel.trim() || !task) return;
    await patchTask({ labels: [...task.labels, newLabel.trim()] });
    setNewLabel('');
  }

  async function handleAddResource() {
    if (!newResource.trim() || !task) return;
    await patchTask({ resources: [...task.resources, newResource.trim()] });
    setNewResource('');
  }

  async function handleAddTeam(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const value = newTeam.trim();
    if (!task || !value || task.teams.includes(value)) {
      setNewTeam('');
      return;
    }
    await patchTask({ teams: [...task.teams, value] });
    setNewTeam('');
  }

  async function handleRemoveTeam(team: string) {
    if (!task) return;
    await patchTask({ teams: task.teams.filter((t) => t !== team) });
  }

  async function handleDateChange(field: 'startDate' | 'dueDate', date: Date | undefined) {
    if (!date) return;
    await patchTask({ [field]: date.toISOString() });
  }

  async function handlePostComment() {
    if (!comment.trim() || !task) return;
    setPostingComment(true);
    try {
      const updated = await addComment(task._id, comment.trim());
      setTask(updated);
      setComment('');
    } finally {
      setPostingComment(false);
    }
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading...</div>;
  if (!task) return <div className="p-8 text-sm text-muted-foreground">Task not found.</div>;

  const reporterUser = userMap.get(task.reporter);

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

          {/* Labels */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Labels</p>
            <div className="flex flex-wrap items-center gap-2">
              {task.labels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
              <Input
                placeholder="+ Add label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
                className="h-7 w-32 text-xs"
              />
            </div>
          </div>

          {/* Resources */}
                   <div>
            <p className="text-sm text-muted-foreground mb-2">Resources</p>
            <div className="space-y-1 mb-2">
              {task.resources.map((r, i) => {
                return (
                  <a key={i} href={r} target="_blank" rel="noopener noreferrer" className="block text-sm text-primary underline truncate">
                    {r}
                  </a>
                );
              })}
            </div>
            <Input
              placeholder="Add document or link"
              value={newResource}
              onChange={(e) => setNewResource(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddResource()}
              className="h-8 text-sm"
            />
          </div>

          {/* Subtasks */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-foreground mb-3">Subtasks</p>
            <SubtasksTable parentTaskId={task._id} />
          </div>

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
            <Button
              size="sm"
              className="mt-2"
              onClick={handlePostComment}
              disabled={postingComment || !comment.trim()}
            >
              {postingComment ? 'Posting...' : 'Post Comment'}
            </Button>
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
              <p className="text-muted-foreground mb-1">Members</p>
              <MembersPicker selectedIds={task.members} onChange={handleMembersChange} />
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Start Date</p>
              <Popover>
                <PopoverTrigger className="w-full text-left rounded-md border px-2 py-1.5 hover:bg-accent">
                  {task.startDate ? format(new Date(task.startDate), 'dd MMM yyyy') : 'Set date'}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={task.startDate ? new Date(task.startDate) : undefined}
                    onSelect={(d) => handleDateChange('startDate', d)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Due Date</p>
              <Popover>
                <PopoverTrigger className="w-full text-left rounded-md border px-2 py-1.5 hover:bg-accent">
                  {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : 'Set date'}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={task.dueDate ? new Date(task.dueDate) : undefined}
                    onSelect={(d) => handleDateChange('dueDate', d)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Teams</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {task.teams.map((team) => (
                  <Badge key={team} variant="secondary" className="gap-1">
                    {team}
                    <button
                      onClick={() => handleRemoveTeam(team)}
                      className="ml-0.5 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <input
                value={newTeam}
                onChange={(e) => setNewTeam(e.target.value)}
                onKeyDown={handleAddTeam}
                placeholder="Add team, press Enter"
                className="w-full rounded-md border px-2 py-1.5 text-sm bg-background"
              />
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Reporter</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={reporterUser?.avatarUrl || getAvatarUrl(task.reporter)} />
                  <AvatarFallback className="text-xs">
                    {reporterUser?.fullName?.[0] ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground">{reporterUser?.fullName ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* Updates / Activity feed */}
          {task.updates.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Updates</p>
              <div className="space-y-2">
                {[...task.updates].reverse().map((u, i) => {
                  const changer = userMap.get(u.changedBy);
                  return (
                    <p key={i} className="text-xs text-muted-foreground">
                      <span className="text-foreground font-medium">
                        {changer?.fullName ?? 'Someone'}
                      </span>{' '}
                      changed {u.field} from &quot;{u.oldValue ?? 'none'}&quot; to &quot;
                      {u.newValue}&quot; ·{' '}
                      {formatDistanceToNow(new Date(u.changedAt), { addSuffix: true })}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}