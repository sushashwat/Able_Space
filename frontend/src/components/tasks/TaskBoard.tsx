'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';
import { getTasks, updateTask } from '@/lib/api/tasks';
import type { Task, TaskStatus } from '@/lib/types/tasks';

const columns: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

export function TaskBoard({ onTaskClick }: { onTaskClick: (id: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);

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

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading tasks...</div>;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto p-6 h-full">
        {columns.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const taskId = e.dataTransfer.getData('taskId');
                handleDrop(taskId, status);
              }}
            >
              <div className="flex items-center justify-between p-3">
                <span className="text-sm font-semibold text-gray-700">
                  {status} <span className="text-gray-400">({columnTasks.length})</span>
                </span>
                <Plus
                  className="h-4 w-4 text-gray-400 cursor-pointer"
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
                className="mx-3 mb-3 text-left text-xs text-gray-500 hover:text-gray-700"
              >
                + Add Task
              </button>
            </div>
          );
        })}
      </div>

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