import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class FileUploadController {
  @Get('quota')
  getQuota(@Request() req) {
    return {
      success: true,
      data: {
        used: 0,
        limit: 100 * 1024 * 1024, // 100MB
        remaining: 100 * 1024 * 1024,
        percentage: 0,
        formatted: {
          used: '0 MB',
          limit: '100 MB',
          remaining: '100 MB'
        }
      },
      message: 'Storage quota retrieved',
      timestamp: new Date().toISOString(),
      path: '/api/v1/uploads/quota'
    };
  }
}
