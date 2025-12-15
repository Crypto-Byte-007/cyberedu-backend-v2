import { ConfigService } from '@nestjs/config';
export declare class AppConfigService {
    private configService;
    constructor(configService: ConfigService);
    get nodeEnv(): string;
    get port(): number;
    get apiPrefix(): string;
    get isDevelopment(): boolean;
    get isProduction(): boolean;
    get database(): {
        uri: string;
        testUri: string;
    };
    get jwt(): {
        secret: string;
        expiration: string;
    };
    get logging(): {
        level: string;
        logToFile: boolean;
    };
}
