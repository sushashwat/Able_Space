'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createProject } from '@/lib/api/projects';
import type { Priority, ProjectStatus } from '@/lib/types/project';

const priorities: Priority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];
const statuses: ProjectStatus[] = ['Backlog', 'Planned', 'In Progress', 'Completed', 'On Hold'];

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function AddProjectModal({ open, onClose, onCreated }: AddProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('No Priority');
  const [status, setStatus] = useState<ProjectStatus>('Backlog');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createProject({ title, description, priority, status });
      setTitle('');
      setDescription('');
      setPriority('No Priority');
      setStatus('Backlog');
      onCreated();
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select
            value={priority}
            onValueChange={(v) => v && setPriority(v as Priority)}
          >
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

          <Select
            value={status}
            onValueChange={(v) => v && setStatus(v as ProjectStatus)}
          >
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

          <Button
            onClick={handleSubmit}
            disabled={submitting || !title.trim()}
            className="w-full"
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}