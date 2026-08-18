import { apiClient } from './client';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  PaginatedTasksResponse,
} from '@/lib/types/tasks';

interface TaskFilters {
  projectId?: string;
  status?: string;
  parentTask?: string;
  page?: number;
  limit?: number;
}

export async function getTasks(filters?: TaskFilters): Promise<PaginatedTasksResponse> {
  const { data } = await apiClient.get<PaginatedTasksResponse>('/tasks', {
    params: filters,
  });
  return data;
}

export async function getTaskById(id: string): Promise<Task> {
  const { data } = await apiClient.get<Task>(`/tasks/${id}`);
  return data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data } = await apiClient.post<Task>('/tasks', input);
  return data;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const { data } = await apiClient.patch<Task>(`/tasks/${id}`, input);
  return data;
}

export async function deleteTask(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/tasks/${id}`);
  return data;
}