import { UsersService } from '../users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        users: import("../schemas/user.schema").UserDocument[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<import("../schemas/user.schema").UserDocument>;
}
