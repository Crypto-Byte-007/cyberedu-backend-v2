import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('nodeEnv', 'development');
  }

  get port(): number {
    return this.configService.get<number>('port', 3000);
  }

  get apiPrefix(): string {
    return this.configService.get<string>('apiPrefix', '/api/v1');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get database() {
    return {
      uri: this.configService.get<string>('database.uri', 'mongodb://localhost:27017/cyberedu'),
      testUri: this.configService.get<string>('database.testUri', 'mongodb://localhost:27017/cyberedu_test'),
    };
  }

  get jwt() {
    return {
      secret: this.configService.get<string>('jwt.secret', 'change_this_in_production'),
      expiration: this.configService.get<string>('jwt.expiration', '24h'),
    };
  }

  get logging() {
    return {
      level: this.configService.get<string>('logging.level', 'info'),
      logToFile: this.configService.get<boolean>('logging.logToFile', false),
    };
  }
}