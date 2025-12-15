import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { UsersService } from '../users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangeUserStatusDto } from '../dto/change-user-status.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('role') role?: UserRole,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return await this.usersService.findAllUsers({
      page,
      limit,
      role,
      status,
      search,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async changeStatus(
    @Param('id') id: string,
    @Body() changeUserStatusDto: ChangeUserStatusDto,
  ) {
    return await this.usersService.changeUserStatus(id, changeUserStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return await this.usersService.softDeleteUser(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    return await this.usersService.restoreUser(id);
  }
}
