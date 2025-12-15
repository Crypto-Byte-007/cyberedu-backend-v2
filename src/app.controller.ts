import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getRoot() {
    return {
      message: 'CyberEdu API',
      version: '0.1.0',
      documentation: '/api/v1/docs',
      health: '/api/v1/health',
    };
  }
}