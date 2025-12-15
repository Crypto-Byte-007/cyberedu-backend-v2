import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      if (this.connection.db) {
        await this.connection.db.admin().ping();
        this.logger.log('✅ MongoDB connected successfully');
        this.logger.log(`📊 Database name: ${this.connection.db.databaseName}`);
      } else {
        this.logger.error('❌ MongoDB connection not established');
      }
    } catch (error: any) {
      this.logger.error('❌ Failed to connect to MongoDB', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.connection.close();
      this.logger.log('MongoDB connection closed');
    } catch (error: any) {
      this.logger.error('Error closing MongoDB connection', error.stack);
    }
  }

  getConnection(): Connection {
    return this.connection;
  }

  async checkConnection(): Promise<boolean> {
    try {
      if (this.connection.db) {
        await this.connection.db.admin().ping();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}