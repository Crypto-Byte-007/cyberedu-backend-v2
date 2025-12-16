import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        console.log('✅ Mongo URI:', config.database.uri);
        return {
          uri: config.database.uri,
          dbName: 'cyberedu',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
