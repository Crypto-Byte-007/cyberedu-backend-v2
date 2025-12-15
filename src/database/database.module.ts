import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '../config/config.service';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        uri: configService.database.uri,
        retryAttempts: 3,
        retryDelay: 1000,
        connectionFactory: (connection: any) => {
          connection.on('connected', () => {
            console.log(`Mongoose connected to ${connection.db.databaseName}`);
          });
          connection.on('error', (error: any) => {
            console.error('Mongoose connection error:', error);
          });
          connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
          });
          return connection;
        },
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}