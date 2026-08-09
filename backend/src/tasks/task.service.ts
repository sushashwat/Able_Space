
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = new this.taskModel({
      ...createTaskDto,
      reporter: userId,
    });
    return task.save();
  }

  async findAll(userId: string, filters?: { projectId?: string; status?: string }) {
    const query: Record<string, any> = { reporter: userId };

    if (filters?.projectId) query.projectId = filters.projectId;
    if (filters?.status) query.status = filters.status;

    return this.taskModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string) {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    if (task.reporter.toString() !== userId) {
      throw new ForbiddenException('Not allowed to access this task');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id, userId); // reuse ownership check
    Object.assign(task, updateTaskDto);
    return task.save();
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id, userId);
    await task.deleteOne();
    return { message: 'Task deleted successfully' };
  }
}