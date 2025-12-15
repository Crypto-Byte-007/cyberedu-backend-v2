import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    logout(req: any): Promise<{
        message: string;
    }>;
    refreshTokens(req: any): Promise<import("./interfaces/tokens.interface").Tokens>;
    getProfile(req: any): any;
}
