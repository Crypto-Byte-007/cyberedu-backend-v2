import { UserRole } from '../../users/schemas/user.schema';
export declare class RegisterDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role?: UserRole;
}
