import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { PasswordUtil } from '../../common/utils/password.util';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getProfile(@Request() req) {
    return await this.usersService.findById(req.user.id);
  }

  @Put()
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Patch('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.getUserWithPassword(req.user.id);
    
    const isPasswordValid = await PasswordUtil.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (!PasswordUtil.validateStrength(changePasswordDto.newPassword)) {
      throw new BadRequestException(
        'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      );
    }

    const hashedPassword = await PasswordUtil.hash(changePasswordDto.newPassword);
    await this.usersService.updatePassword(req.user.id, hashedPassword);
    
    return { message: 'Password changed successfully' };
  }
}
