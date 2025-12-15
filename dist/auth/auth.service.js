"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const password_util_1 = require("../common/utils/password.util");
const config_service_1 = require("../config/config.service");
let AuthService = class AuthService {
    constructor(userModel, jwtService, configService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const existingUser = await this.userModel.findOne({
            email: registerDto.email.toLowerCase(),
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (!password_util_1.PasswordUtil.validateStrength(registerDto.password)) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        }
        const hashedPassword = await password_util_1.PasswordUtil.hash(registerDto.password);
        const user = await this.userModel.create({
            email: registerDto.email.toLowerCase(),
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: registerDto.role || user_schema_1.UserRole.STUDENT,
        });
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }
    async login(loginDto) {
        const user = await this.userModel.findOne({
            email: loginDto.email.toLowerCase(),
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await password_util_1.PasswordUtil.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.lastLoginAt = new Date();
        await user.save();
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: null,
        });
        return { message: 'Logout successful' };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userModel.findById(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const refreshTokenMatches = await password_util_1.PasswordUtil.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.jwt.secret,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.jwt.secret,
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await password_util_1.PasswordUtil.hash(refreshToken);
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    sanitizeUser(user) {
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.refreshToken;
        delete userObject.verificationToken;
        delete userObject.passwordResetToken;
        delete userObject.passwordResetExpires;
        return userObject;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_service_1.AppConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map