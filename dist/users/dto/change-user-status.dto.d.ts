import { UserStatus } from '../schemas/user.schema';
export declare class ChangeUserStatusDto {
    status: UserStatus;
    reason?: string;
}
