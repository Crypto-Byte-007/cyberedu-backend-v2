import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  @Get('my')
  getMyReports(@Request() req) {
    return {
      success: true,
      data: {
        reports: [],
        summary: {
          totalReports: 0,
          averageScore: 0,
          totalTimeSpent: 0
        }
      },
      message: 'Reports retrieved successfully',
      timestamp: new Date().toISOString(),
      path: '/api/v1/reports/my'
    };
  }
}
