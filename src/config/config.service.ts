import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return Number(this.configService.get<number>('PORT', 3000));
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX', '/api/v1');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv !== 'production';
  }

  get database() {
    const uri = this.configService.get<string>('MONGO_URI');

    if (!uri) {
      throw new Error('❌ MONGO_URI is not defined');
    }

    return {
      uri,
    };
  }

  get jwt() {
    return {
      secret: this.configService.get<string>('JWT_SECRET', 'change_this'),
      expiration: this.configService.get<string>('JWT_EXPIRATION', '24h'),
    };
  }
}
