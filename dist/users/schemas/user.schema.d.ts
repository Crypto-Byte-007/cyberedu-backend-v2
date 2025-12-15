import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare enum UserRole {
    STUDENT = "student",
    INSTRUCTOR = "instructor",
    ADMIN = "admin"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending"
}
export declare class User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    isActive: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    phoneNumber?: string;
    institution?: string;
    department?: string;
    studentId?: string;
    avatar?: string;
    bio?: string;
    dateOfBirth?: Date;
    preferences?: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        theme: 'light' | 'dark';
        language: string;
    };
    refreshToken?: string;
    lastLoginAt?: Date;
    lastPasswordChangeAt?: Date;
    emailVerifiedAt?: Date;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    deletedAt?: Date;
    metadata?: {
        registrationSource?: string;
        lastIpAddress?: string;
        userAgent?: string;
        failedLoginAttempts?: number;
        lockedUntil?: Date;
    };
    get fullName(): string;
    get isLocked(): boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
