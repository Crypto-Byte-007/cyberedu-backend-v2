import { UserRole } from '../schemas/user.schema';
import { UsersService } from '../users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangeUserStatusDto } from '../dto/change-user-status.dto';
export declare class AdminController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page: number, limit: number, role?: UserRole, status?: string, search?: string): Promise<{
        users: import("../schemas/user.schema").UserDocument[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<import("../schemas/user.schema").UserDocument>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../schemas/user.schema").UserDocument>;
    changeStatus(id: string, changeUserStatusDto: ChangeUserStatusDto): Promise<import("../schemas/user.schema").UserDocument>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
    restore(id: string): Promise<import("../schemas/user.schema").UserDocument>;
}
