import { Module } from '@nestjs/common';
import { ComplaintService } from './services/complaint.service';
import { ComplaintController } from './api/controllers/complaint.controller';

@Module({
  providers: [ComplaintService],
  controllers: [ComplaintController],
  exports: [ComplaintService],
})
export class ComplaintModule {}