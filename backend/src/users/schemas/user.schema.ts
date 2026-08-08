import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ default: null })
  password!: string;

  @Prop({ required: true, default: 'Dexter' })
  fullName!: string;

  @Prop({ default: '' })
  title!: string;

  @Prop({ default: '' })
  username!: string;

  @Prop({ default: '' })
  avatarUrl!: string;

  @Prop({ default: false })
  isGuest!: boolean;

  @Prop({ default: null })
  googleId!: string;

  @Prop({ default: 'light', enum: ['light', 'dark'] })
  theme!: string;

  @Prop({ default: 'blue', enum: ['amber', 'blue', 'pink', 'rose', 'emerald', 'black'] })
  colorMode!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);