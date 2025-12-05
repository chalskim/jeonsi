import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from './controllers/file-upload.controller';
import { FileUploadService } from './services/file-upload.service';

@Module({
  imports: [
    MulterModule.register({
      // 기본 설정 (필요에 따라 각 엔드포인트에서 개별 설정)
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
