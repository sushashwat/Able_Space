'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AddProjectModal } from './AddProjectModal';
import { FieldsDropdown } from '@/components/tasks/FieldsDropdown';
import { getProjects } from '@/lib/api/projects';
import { getAllUsers } from '@/lib/api/users';
import { UserSummary } from '@/lib/types/user';
import { getAvatarUrl } from '@/lib/utils';
import type { Project } from '@/lib/types/project';
import { format } from 'date-fns';

const priorityColor: Record<string, string> = {
  Urgent: 'text-red-600',
  High: 'text-orange-500',
  Medium: 'text-yellow-600',
  Low: 'text-muted-foreground',
  'No Priority': 'text-gray-300',
};

const FIELD_LABELS: Record<string, string> = {
  priority: 'Priority',
  status: 'Status',
  dueDate: 'Due Date',
  lead: 'Lead',
};

const FIELDS_STORAGE_KEY = 'projects-table-fields';

const DEFAULT_FIELDS: Record<string, boolean> = {
  priority: true,
  status: true,
  dueDate: true,
  lead: true,
};

export function ProjectsTable() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [userMap, setUserMap] = useState<Map<string, UserSummary>>(new Map());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [fields, setFields] = useState<Record<string, boolean>>(DEFAULT_FIELDS);

  useEffect(() => {
    const stored = localStorage.getItem(FIELDS_STORAGE_KEY);
    if (stored) {
      try {
        setFields({ ...DEFAULT_FIELDS, ...JSON.parse(stored) });
      } catch {
        // ignore malformed stored value, fall back to defaults
      }
    }
    loadProjects();
    loadUsers();
  }, []);

  function loadProjects() {
    setLoading(true);
    getProjects({ limit: 100 })
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }

  function loadUsers() {
    getAllUsers()
      .then((users) => {
        const map = new Map<string, UserSummary>();
        users.forEach((u) => map.set (u._id, u));
        setUserMap(map);
      })
      .catch(() => {
        // non-fatal: table still works without lead names/avatars
      });
  }

  function handleFieldsChange(key: string, value: boolean) {
    const next = { ...fields, [key]: value };
    setFields(next);
    localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <FieldsDropdown fields={fields} onChange={handleFieldsChange} labels={FIELD_LABELS} />
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-sm text-muted-foreground">No projects yet.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 font-medium">Projects</th>
              {fields.priority && <th className="pb-2 font-medium">Priority</th>}
              {fields.status && <th className="pb-2 font-medium">Status</th>}
              {fields.dueDate && <th className="pb-2 font-medium">Due Date</th>}
              {fields.lead && <th className="pb-2 font-medium">Lead</th>}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const leadUser = project.lead ? userMap.get(project.lead) : undefined;
              return (
                <tr
                  key={project._id}
                  onClick={() => router.push(`/projects/${project._id}`)}
                  className="cursor-pointer border-b hover:bg-accent"
                >
                  <td className="py-3 font-medium text-foreground">{project.title}</td>
                  {fields.priority && (
                    <td className="py-3">
                      <span className={priorityColor[project.priority]}>
                        {project.priority}
                      </span>
                    </td>
                  )}
                  {fields.status && (
                    <td className="py-3">
                      <Badge variant="secondary">{project.status}</Badge>
                    </td>
                  )}
                  {fields.dueDate && (
                    <td className="py-3 text-muted-foreground">
                      {project.dueDate ? format(new Date(project.dueDate), 'dd MMM yyyy') : '—'}
                    </td>
                  )}
                  {fields.lead && (
                    <td className="py-3">
                      {project.lead ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={leadUser?.avatarUrl || getAvatarUrl(project.lead)}
                            />
                            <AvatarFallback className="text-xs">
                              {leadUser?.fullName?.[0] ?? 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">
                            {leadUser?.fullName ?? '—'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <AddProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadProjects}
      />
    </div>
  );
}