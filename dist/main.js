"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_service_1 = require("./config/config.service");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const transform_response_interceptor_1 = require("./common/interceptors/transform-response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_service_1.AppConfigService);
    app.setGlobalPrefix(configService.apiPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new transform_response_interceptor_1.TransformResponseInterceptor());
    app.enableCors({
        origin: configService.isDevelopment ? '*' : [],
        credentials: true,
    });
    const port = configService.port;
    await app.listen(port);
    console.log(`
  🚀 CyberEdu Backend Started
  ----------------------------------
  ✅ Environment: ${configService.nodeEnv}
  ✅ API: http://localhost:${port}${configService.apiPrefix}
  ✅ Health: http://localhost:${port}${configService.apiPrefix}/health
  ✅ Database: ${configService.database.uri}
  ✅ Authentication: JWT System Ready
  ----------------------------------
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map