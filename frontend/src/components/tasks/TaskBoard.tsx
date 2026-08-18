'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { TaskListView } from './TaskListView';
import { FieldsDropdown } from './FieldsDropdown';
import { AddTaskModal } from './AddTaskModal';
import { getTasks, updateTask } from '@/lib/api/tasks';
import type { Task, TaskStatus } from '@/lib/types/tasks';

const columns: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

const fieldLabels = {
  priority: 'Priority',
  members: 'Members',
  dueDate: 'Due Date',
  labels: 'Labels',
  status: 'Status',
  reporter: 'Reporter',
};

export function TaskBoard({ onTaskClick }: { onTaskClick: (id: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [search, setSearch] = useState('');
  const [fields, setFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
    labels: false,
    status: false,
    reporter: false,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await getTasks({ limit: 100 });
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDrop(taskId: string, newStatus: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );
    try {
      await updateTask(taskId, { status: newStatus });
    } catch {
      loadTasks();
    }
  }

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tasks, search]);

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading tasks...</div>;

  return (
    <>
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`p-1.5 ${view === 'list' ? 'bg-accent' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('board')}
              className={`p-1.5 ${view === 'board' ? 'bg-accent' : ''}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <FieldsDropdown
            fields={fields}
            labels={fieldLabels}
            onChange={(key, value) => setFields((prev) => ({ ...prev, [key]: value }))}
          />

          <Button size="sm" onClick={() => setModalStatus('To Do')}>
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto p-6 h-full">
          {columns.map((status) => {
            const columnTasks = filteredTasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="flex w-72 shrink-0 flex-col rounded-lg bg-muted"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const taskId = e.dataTransfer.getData('taskId');
                  handleDrop(taskId, status);
                }}
              >
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-semibold text-foreground">
                    {status} <span className="text-muted-foreground">({columnTasks.length})</span>
                  </span>
                  <Plus
                    className="h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() => setModalStatus(status)}
                  />
                </div>

                <div className="flex flex-col gap-2 px-3 pb-3 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('taskId', task._id)}
                    >
                      <TaskCard task={task} onClick={() => onTaskClick(task._id)} />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setModalStatus(status)}
                  className="mx-3 mb-3 text-left text-xs text-muted-foreground hover:text-foreground"
                >
                  + Add Task
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <TaskListView tasks={filteredTasks} visibleFields={fields} onTaskClick={onTaskClick} />
      )}

      {modalStatus && (
        <AddTaskModal
          open={!!modalStatus}
          onClose={() => setModalStatus(null)}
          defaultStatus={modalStatus}
          onCreated={loadTasks}
        />
      )}
    </>
  );
}