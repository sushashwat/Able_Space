import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['No Priority', 'Urgent', 'High', 'Medium', 'Low'])
  @IsOptional()
  priority?: string;

  @IsEnum(['Backlog', 'Planned', 'In Progress', 'Completed', 'On Hold'])
  @IsOptional()
  status?: string;

  @IsMongoId()
  @IsOptional()
  lead?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  members?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teams?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];
}