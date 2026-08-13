import { apiClient } from './client';
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  PaginatedProjectsResponse,
} from '@/lib/types/project';

interface ProjectFilters {
  page?: number;
  limit?: number;
}

export async function getProjects(filters?: ProjectFilters): Promise<PaginatedProjectsResponse> {
  const { data } = await apiClient.get<PaginatedProjectsResponse>('/projects', {
    params: filters,
  });
  return data;
}

export async function getProjectById(id: string): Promise<Project> {
  const { data } = await apiClient.get<Project>(`/projects/${id}`);
  return data;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const { data } = await apiClient.post<Project>('/projects', input);
  return data;
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  const { data } = await apiClient.patch<Project>(`/projects/${id}`, input);
  return data;
}

export async function deleteProject(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/projects/${id}`);
  return data;
}