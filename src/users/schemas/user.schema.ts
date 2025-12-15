import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      delete ret.password;
      delete ret.refreshToken;
      delete ret.verificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ trim: true })
  phoneNumber?: string;

  @Prop({ trim: true })
  institution?: string;

  @Prop({ trim: true })
  department?: string;

  @Prop({ trim: true })
  studentId?: string;

  @Prop({ trim: true })
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ type: Object })
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };

  @Prop()
  @Exclude()
  refreshToken?: string;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  lastPasswordChangeAt?: Date;

  @Prop()
  emailVerifiedAt?: Date;

  @Prop()
  @Exclude()
  verificationToken?: string;

  @Prop()
  verificationTokenExpires?: Date;

  @Prop()
  @Exclude()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: Object })
  metadata?: {
    registrationSource?: string;
    lastIpAddress?: string;
    userAgent?: string;
    failedLoginAttempts?: number;
    lockedUntil?: Date;
  };

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isLocked(): boolean {
    return this.metadata?.lockedUntil ? this.metadata.lockedUntil > new Date() : false;
  }

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ isDeleted: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'metadata.lastIpAddress': 1 });
UserSchema.index({ studentId: 1 }, { sparse: true });
