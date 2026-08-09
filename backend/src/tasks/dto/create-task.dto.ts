import { IsString, IsOptional, IsEnum, IsArray, IsMongoId, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['To Do', 'Doing', 'Completed', 'On Hold'])
  status?: string;

  @IsOptional()
  @IsEnum(['No Priority', 'Urgent', 'High', 'Medium', 'Low'])
  priority?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  members?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsArray()
  labels?: string[];

  @IsOptional()
  @IsMongoId()
  parentTask?: string;

  @IsOptional()
  @IsMongoId()
  project?: string;
}