import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordUtil } from '../common/utils/password.util';
import { Tokens, JwtPayload } from './interfaces/tokens.interface';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: AppConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    // Check if user exists
    const existingUser = await this.userModel.findOne({
      email: registerDto.email.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate password strength
    if (!PasswordUtil.validateStrength(registerDto.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      );
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(registerDto.password);

    // Create user
    const user = await this.userModel.create({
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role || UserRole.STUDENT,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    // Find user
    const user = await this.userModel.findOne({
      email: loginDto.email.toLowerCase(),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });

    return { message: 'Logout successful' };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userModel.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    // Verify refresh token
    const refreshTokenMatches = await PasswordUtil.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(user: UserDocument): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.jwt.secret,
        expiresIn: '15m', // Access token expires in 15 minutes
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.jwt.secret,
        expiresIn: '7d', // Refresh token expires in 7 days
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await PasswordUtil.hash(refreshToken);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private sanitizeUser(user: UserDocument): any {
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.verificationToken;
    delete userObject.passwordResetToken;
    delete userObject.passwordResetExpires;
    return userObject;
  }
}