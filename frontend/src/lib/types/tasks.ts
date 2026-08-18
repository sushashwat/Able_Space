export type TaskStatus = 'To Do' | 'Doing' | 'Completed' | 'On Hold';
export type Priority = 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Comment {
  author: string;
  text: string;
  createdAt: string;
}

export interface TaskUpdate {
  field: string;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  changedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  members: string[];
  dueDate: string | null;
  startDate: string | null;
  labels: string[];
  teams: string[];
  resources: string[];
  parentTask: string | null;
  project: string | null;
  reporter: string;
  comments: Comment[];
  updates: TaskUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  members?: string[];
  dueDate?: string;
  startDate?: string;
  labels?: string[];
  teams?: string[];
  resources?: string[];
  parentTask?: string;
  project?: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface PaginatedTasksResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}