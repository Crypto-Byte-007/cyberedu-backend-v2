import { UserRole, UserStatus } from '../schemas/user.schema';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    isActive?: boolean;
    isVerified?: boolean;
    phoneNumber?: string;
    institution?: string;
    department?: string;
    studentId?: string;
    avatar?: string;
    bio?: string;
    dateOfBirth?: string;
}
