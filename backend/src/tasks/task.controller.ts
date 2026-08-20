// backend/src/tasks/tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() body: { text: string },
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.tasksService.addComment(id, body.text, userId);
  }

  @Get()
  findAll(
    @Req() req: Request,
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
    @Query('parentTask') parentTask?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = (req.user as any).userId;
    return this.tasksService.findAll(userId, {
      projectId,
      status,
      parentTask,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.tasksService.remove(id, userId);
  }
}