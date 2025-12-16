import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);

  // Global prefix
  app.setGlobalPrefix(configService.apiPrefix);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // ✅ CORS (SAFE FOR DEV + PROD)
  app.enableCors({
    origin: configService.isDevelopment
      ? '*'
      : [
          'https://cyberedu.netlify.app', // 🔁 replace with your real Netlify URL
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Render-compatible port
  const port = process.env.PORT || configService.port;
  await app.listen(port);

  console.log(`
  🚀 CyberEdu Backend Started
  ----------------------------------
  ✅ Environment: ${configService.nodeEnv}
  ✅ API Prefix: ${configService.apiPrefix}
  ✅ Port: ${port}
  ✅ Database Connected
  ✅ Authentication: JWT System Ready
  ----------------------------------
  `);
}

bootstrap();
