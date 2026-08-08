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

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  lead!: Types.ObjectId;

  @Prop({ default: null })
  dueDate!: Date;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members!: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);