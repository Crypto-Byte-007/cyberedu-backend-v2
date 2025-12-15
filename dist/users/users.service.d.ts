import { Model } from 'mongoose';
import { UserDocument, UserRole } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
    getUserWithPassword(userId: string): Promise<UserDocument>;
    findAllUsers(query: {
        page: number;
        limit: number;
        role?: UserRole;
        status?: string;
        search?: string;
    }): Promise<{
        users: UserDocument[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findUserById(id: string): Promise<UserDocument>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    changeUserStatus(id: string, changeUserStatusDto: ChangeUserStatusDto): Promise<UserDocument>;
    softDeleteUser(id: string): Promise<{
        message: string;
    }>;
    restoreUser(id: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument>;
}
