import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './interfaces/tokens.interface';
import { AppConfigService } from '../config/config.service';
export declare class AuthService {
    private userModel;
    private jwtService;
    private configService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, configService: AppConfigService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<Tokens>;
    private generateTokens;
    private updateRefreshToken;
    private sanitizeUser;
}
