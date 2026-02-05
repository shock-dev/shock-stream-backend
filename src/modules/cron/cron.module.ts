import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { MailService } from '@/src/modules/lib/mail/mail.service'

import { CronService } from './cron.service'

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [CronService, MailService]
})
export class CronModule {}
