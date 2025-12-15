import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Request() req,
    @Query('unreadOnly', new DefaultValuePipe(false), ParseBoolPipe) unreadOnly: boolean,
    @Query('limit') limit?: number,
  ) {
    return await this.notificationsService.getUserNotifications(req.user.id, {
      unreadOnly,
      limit: limit ? parseInt(limit.toString()) : 50,
    });
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id') id: string, @Request() req) {
    return await this.notificationsService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Request() req) {
    return await this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNotification(@Param('id') id: string, @Request() req) {
    await this.notificationsService.deleteNotification(id, req.user.id);
    return { message: 'Notification deleted successfully' };
  }
}
