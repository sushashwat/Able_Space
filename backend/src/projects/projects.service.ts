import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) { }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const project = new this.projectModel({
      ...createProjectDto,
      reporter: userId,
      lead: createProjectDto.lead || userId,
    });
    return project.save();
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const query = {
      $or: [{ reporter: userId }, { lead: userId }, { members: userId }],
    };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.projectModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.projectModel.countDocuments(query),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, userId: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) throw new NotFoundException('Project not found');

    const isReporter = project.reporter?.toString() === userId;
    const isLead = project.lead?.toString() === userId;
    const isMember = project.members.some((m) => m.toString() === userId);
    if (!isReporter && !isLead && !isMember) {
      throw new ForbiddenException('Not allowed to access this project');
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) throw new NotFoundException('Project not found');

    const canEdit =
      project.reporter?.toString() === userId ||
      project.lead?.toString() === userId;
    if (!canEdit) {
      throw new ForbiddenException('Only reporter or lead can update this project');
    }

    Object.assign(project, updateProjectDto);
    return project.save();
  }

  async remove(id: string, userId: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) throw new NotFoundException('Project not found');

    if (project.reporter?.toString() !== userId) {
      throw new ForbiddenException('Only reporter can delete this project');
    }

    await project.deleteOne();
    return { message: 'Project deleted successfully' };
  }
}