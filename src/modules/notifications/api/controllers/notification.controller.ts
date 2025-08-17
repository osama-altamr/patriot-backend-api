import { Controller, Delete, Get, Param, HttpCode, HttpStatus, UseGuards, Body, Post, Query } from "@nestjs/common";
import { NotificationService } from "../../services/notification.service"; // Adjust path
import { Notification, User } from "src/database"; // Adjust path
import { JwtAuthGuard } from "@Package/auth";
import { CurrentUser } from "@Package/api";
import { UnReadNotificationsDto } from "../dto/request/unread-notification.dto";
import { UncreateNotificationsValidation } from "../validation/unread-notification.pipe";

@Controller("notifications")
export class NotificationController {
    constructor(private readonly NotificationService: NotificationService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll(@CurrentUser() user: User, @Query('isSeen') isSeen?: boolean){
        const data = await this.NotificationService.getAllNotifications(user.id, isSeen);
        return {
            results: data,
            total: data.length
        }
    }
    
    @Get('unread-count')
    @UseGuards(JwtAuthGuard)
    async getUnreadCount(@CurrentUser() user: User): Promise<{count: number}> {
        const data = await this.NotificationService.getUnredNotifications(user.id);
        return {
            count: data.length
        }
    }
    
    @Post('dismiss')
    async dismissNotifications(
        @Body(UncreateNotificationsValidation) uncreadData: UnReadNotificationsDto,
    ){
        await this.NotificationService.dismissByIds(uncreadData)
    }

    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<Notification> {
        return await this.NotificationService.getNotification(idParam);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteNotification(@Param('id') idParam: string): Promise<void> {
     await this.NotificationService.deleteNotification(idParam);
    }


}