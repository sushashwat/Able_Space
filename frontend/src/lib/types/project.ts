export type ProjectStatus = 'Backlog' | 'Planned' | 'In Progress' | 'Completed' | 'On Hold';
export type Priority = 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Project {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  status: ProjectStatus;
  lead: string | null; // User ID
  reporter: string; // User ID
  dueDate: string | null;
  members: string[]; // User IDs
  teams: string[];
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  priority?: Priority;
  status?: ProjectStatus;
  lead?: string;
  dueDate?: string;
  members?: string[];
  teams?: string[];
  labels?: string[];
}

export type UpdateProjectInput = Partial<CreateProjectInput>;

export interface PaginatedProjectsResponse {
  data: Project[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}