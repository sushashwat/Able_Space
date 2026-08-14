'use client';

import { ProjectsTable } from '@/components/projects/ProjectsTable';

export default function ProjectsPage() {
  return (
    <div className="h-full">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Projects</h1>
      </div>
      <ProjectsTable />
    </div>
  );
}