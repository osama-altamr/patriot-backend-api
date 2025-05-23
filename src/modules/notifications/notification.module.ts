import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './api/controllers/notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/database';
import { NotificationRepository } from './repository/notification.repository';
import { UserModule } from '/users/user.module';

@Module({
  imports: [UserModule,TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}