
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
  ) { }

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = new this.taskModel({
      ...createTaskDto,
      reporter: userId,
    });
    return task.save();
  }

  async findAll(
    userId: string,
    filters?: { projectId?: string; status?: string; page?: number; limit?: number },
  ) {
    const query: Record<string, any> = { reporter: userId };
    if (filters?.projectId) query.project = filters.projectId;
    if (filters?.status) query.status = filters.status;

    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.taskModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.taskModel.countDocuments(query),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
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