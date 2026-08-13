export type TaskStatus = 'To Do' | 'Doing' | 'Completed' | 'On Hold';
export type Priority = 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Comment {
  author: string; // User ID
  text: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  members: string[]; // User IDs
  dueDate: string | null;
  startDate: string | null;
  labels: string[];
  parentTask: string | null;
  project: string | null;
  reporter: string;
  comments: Comment[];
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