import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ _id: false })
class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author!: Types.ObjectId;

  @Prop({ required: true })
  text!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

@Schema({ _id: false })
class Update {
  @Prop({ required: true })
  field!: string;

  @Prop({ default: null })
  oldValue!: string;

  @Prop({ default: null })
  newValue!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  changedBy!: Types.ObjectId;

  @Prop({ default: Date.now })
  changedAt!: Date;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({
    required: true,
    enum: ['To Do', 'Doing', 'Completed', 'On Hold'],
    default: 'To Do',
  })
  status!: string;

  @Prop({
    enum: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'],
    default: 'No Priority',
  })
  priority!: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members!: Types.ObjectId[];

  @Prop({ default: null })
  dueDate!: Date;

  @Prop({ default: null })
  startDate!: Date;

  @Prop({ type: [String], default: [] })
  labels!: string[];

  @Prop({ type: [String], default: [] })
  teams!: string[];

  @Prop({ type: [String], default: [] })
  resources!: string[];

  @Prop({ type: Types.ObjectId, ref: 'Task', default: null })
  parentTask!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', default: null })
  project!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  reporter!: Types.ObjectId;

  @Prop({ type: [Comment], default: [] })
  comments!: Comment[];

  @Prop({ type: [Update], default: [] })
  updates!: Update[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);