// backend/src/schemas/project.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({
    enum: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'],
    default: 'No Priority',
  })
  priority!: string;

  @Prop({
    enum: ['Backlog', 'Planned', 'In Progress', 'Completed', 'On Hold'],
    default: 'Backlog',
  })
  status!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  lead!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporter!: Types.ObjectId;

  @Prop({ default: null })
  dueDate!: Date;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members!: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  teams!: string[];

  @Prop({ type: [String], default: [] })
  labels!: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);