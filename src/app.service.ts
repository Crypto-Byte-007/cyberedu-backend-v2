import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      service: 'CyberEdu Backend API',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }
}
