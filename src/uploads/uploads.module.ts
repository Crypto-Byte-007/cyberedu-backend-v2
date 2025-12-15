import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from './controllers/file-upload.controller';
import { FileUploadService } from './services/file-upload.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService, MulterModule],
})
export class UploadsModule {}
