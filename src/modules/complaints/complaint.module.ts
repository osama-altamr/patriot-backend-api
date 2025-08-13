import { Module } from '@nestjs/common';
import { ComplaintService } from './services/complaint.service';
import { ComplaintController } from './api/controllers/complaint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from 'src/database';
import { ComplaintRepository } from './repository/complaint.repository';
import { UserModule } from '/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint]), UserModule],
  providers: [ComplaintService, ComplaintRepository],
  controllers: [ComplaintController],
  exports: [ComplaintService, ComplaintRepository],
})
export class ComplaintModule {}