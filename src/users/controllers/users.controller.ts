import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { UsersService } from '../users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async findAll() {
    return await this.usersService.findAllUsers({
      page: 1,
      limit: 10,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }
}
