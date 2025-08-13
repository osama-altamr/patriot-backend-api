import { Module } from '@nestjs/common'
import { MailerService } from './services/mailer.service'

@Module({
    providers: [MailerService],
    exports: [MailerService]
})
export class MailerModule { } 