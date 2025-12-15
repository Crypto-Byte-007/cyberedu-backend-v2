import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';
import configuration from './configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
  ],
  providers: [AppConfigService, ConfigService],
  exports: [AppConfigService, ConfigService],
})
export class AppConfigModule {}