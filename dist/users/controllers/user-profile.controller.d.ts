import { UsersService } from '../users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
export declare class UserProfileController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("../schemas/user.schema").UserDocument>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("../schemas/user.schema").UserDocument>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
