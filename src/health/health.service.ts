import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
    };
  }

  async checkDatabase() {
    const isConnected = await this.databaseService.checkConnection();
    
    if (!isConnected) {
      this.logger.error('Database health check failed');
      throw new Error('Database connection failed');
    }

    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}