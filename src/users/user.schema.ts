import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      delete ret.password;
      delete ret.refreshToken;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  @Exclude()
  refreshToken?: string;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  verificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  createdAt: Date;
  updatedAt: Date;

  // Virtual for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });