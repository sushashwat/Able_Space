import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['To Do', 'Doing', 'Completed', 'On Hold'])
  @IsOptional()
  status?: string;

  @IsEnum(['No Priority', 'Urgent', 'High', 'Medium', 'Low'])
  @IsOptional()
  priority?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  members?: string[];

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teams?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  resources?: string[];

  @IsMongoId()
  @IsOptional()
  parentTask?: string;

  @IsMongoId()
  @IsOptional()
  project?: string;
}