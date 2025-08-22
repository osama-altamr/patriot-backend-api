import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, In } from 'typeorm';
import { OrderItem, OrderItemStatus, Permission } from 'src/database';
import { NotificationService } from '/notifications/services/notification.service';
import { PermissionAccessType } from '/permissions/api/enums/permission.enum';
import { OrderItemRepository } from '../repository/order-item.repository';
import { PermissionRepository } from '/permissions/repository/permission.repository';

@Injectable()
export class TaskSchedulingService {
  private readonly logger = new Logger(TaskSchedulingService.name);

  constructor(
    private readonly orderItemRepo: OrderItemRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly notificationService: NotificationService,
  ) {}


  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleDelayedItemsCron() {
    this.logger.debug('Running cron job to check for delayed order items...');
    const inProgressItems = await this.orderItemRepo.findAllWithPop({
        status: OrderItemStatus.inProgress,
        orderItemActions: {
          endsAt: IsNull(), 
        },
    });

    if (inProgressItems.length === 0) {
      this.logger.debug('No in-progress items to check. Cron job finished.');
      return;
    }

    const delayedItems: OrderItem[] = [];
    for (const item of inProgressItems) {
      const currentAction = item.orderItemActions.find(action => action.endsAt === null);
      const currentStage = item.currentStage;

      if (currentAction && currentStage?.estimatedTimeMinutes) {
        const startTime = new Date(currentAction.startsAt);
        const estimatedEndTime = new Date(startTime.getTime() + currentStage.estimatedTimeMinutes * 60000);
        if (new Date() > estimatedEndTime) {
          delayedItems.push(item);
        }
      }
    }

    if (delayedItems.length > 0) {
      this.logger.warn(`Found ${delayedItems.length} delayed items. Sending notifications...`);
      const usersToNotify = await this.permissionRepo.getAllWithPop({
        accessType: In([PermissionAccessType.admin, PermissionAccessType.employee])
      });

      if (usersToNotify.length > 0) {
        await Promise.all(usersToNotify.map(async admin => {
            for (const item of delayedItems) {
                await this.notificationService.createNotification({
                  title: {
                    en: `Production Delay Alert`,
                    ar: `تنبيه تأخير في الإنتاج`
                  },
                  content: {
                    en: `Item for order #${item.order.ref} has been in the "${item.currentStage.name.en}" stage for too long.`,
                    ar: `العنصر الخاص بالطلب #${item.order.ref} تجاوز الوقت المقدر في مرحلة "${item.currentStage.name.ar}".`
                  },
                  recordId: item.order.id,
                  type: 'order',
                  userId: admin.user.id,
                });
              }

        }))
      }
    } else {
      this.logger.debug('All in-progress items are on schedule. Cron job finished.');
    }
  }
}