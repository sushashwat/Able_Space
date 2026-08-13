'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddProjectModal } from './AddProjectModal';
import { getProjects } from '@/lib/api/projects';
import type { Project } from '@/lib/types/project';
import { format } from 'date-fns';

const priorityColor: Record<string, string> = {
  Urgent: 'text-red-600',
  High: 'text-orange-500',
  Medium: 'text-yellow-600',
  Low: 'text-gray-400',
  'No Priority': 'text-gray-300',
};

export function ProjectsTable() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  function loadProjects() {
    setLoading(true);
    getProjects({ limit: 100 })
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-sm text-gray-500">No projects yet.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium">Projects</th>
              <th className="pb-2 font-medium">Priority</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project._id}
                onClick={() => router.push(`/projects/${project._id}`)}
                className="cursor-pointer border-b hover:bg-gray-50"
              >
                <td className="py-3 font-medium text-gray-900">{project.title}</td>
                <td className="py-3">
                  <span className={priorityColor[project.priority]}>
                    {project.priority}
                  </span>
                </td>
                <td className="py-3">
                  <Badge variant="secondary">{project.status}</Badge>
                </td>
                <td className="py-3 text-gray-500">
                  {project.dueDate ? format(new Date(project.dueDate), 'dd MMM yyyy') : '—'}
                </td>
              </tr>
            ))}
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