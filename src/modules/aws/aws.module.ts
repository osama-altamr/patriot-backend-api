import { Module } from '@nestjs/common';
import { FileUploadService } from './services/s3.service';
import { MediaController } from './api/controllers/media.controller';

@Module({
  controllers: [MediaController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class AWSModule {}